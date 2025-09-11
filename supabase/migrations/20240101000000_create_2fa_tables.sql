-- Create user_2fa table for storing 2FA settings
CREATE TABLE IF NOT EXISTS user_2fa (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  secret TEXT,
  backup_codes TEXT[],
  is_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create user_sessions table for tracking active sessions
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  is_2fa_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  UNIQUE(session_id)
);

-- Create user_login_attempts table for security monitoring
CREATE TABLE IF NOT EXISTS user_login_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  failure_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_2fa_user_id ON user_2fa(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_login_attempts_user_id ON user_login_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_login_attempts_email ON user_login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_user_login_attempts_created_at ON user_login_attempts(created_at);

-- Enable Row Level Security
ALTER TABLE user_2fa ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_login_attempts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_2fa
CREATE POLICY "Users can view their own 2FA settings" ON user_2fa
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2FA settings" ON user_2fa
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2FA settings" ON user_2fa
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_sessions
CREATE POLICY "Users can view their own sessions" ON user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions" ON user_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON user_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" ON user_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_login_attempts
CREATE POLICY "Users can view their own login attempts" ON user_login_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert login attempts" ON user_login_attempts
  FOR INSERT WITH CHECK (true);

-- Create function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM user_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create function to log login attempts
CREATE OR REPLACE FUNCTION log_login_attempt(
  p_user_id UUID,
  p_email TEXT,
  p_ip_address INET,
  p_user_agent TEXT,
  p_success BOOLEAN,
  p_failure_reason TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO user_login_attempts (
    user_id,
    email,
    ip_address,
    user_agent,
    success,
    failure_reason
  ) VALUES (
    p_user_id,
    p_email,
    p_ip_address,
    p_user_agent,
    p_success,
    p_failure_reason
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to check if user has too many failed attempts
CREATE OR REPLACE FUNCTION check_failed_attempts(p_email TEXT, p_hours INTEGER DEFAULT 1)
RETURNS BOOLEAN AS $$
DECLARE
  failed_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO failed_count
  FROM user_login_attempts
  WHERE email = p_email
    AND success = FALSE
    AND created_at > NOW() - INTERVAL '1 hour' * p_hours;
  
  RETURN failed_count >= 5; -- Block after 5 failed attempts in the specified hours
END;
$$ LANGUAGE plpgsql;
