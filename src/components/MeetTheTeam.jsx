import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Heart, 
  Lightbulb, 
  Users, 
  Award,
  Quote,
  Coffee,
  Laptop,
  Target,
  Star
} from 'lucide-react';

const MeetTheTeam = () => {
  return (
    <section className="py-20 bg-[#0A0D14]">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-orbitron gradient-text-cyan">
            👋 Meet the Team
          </h2>
          <p className="text-xl text-[#EAEAEA]/70 max-w-4xl mx-auto">
            Behind every great project is a team that genuinely cares about making it work. 
            Meet the people who turn your ideas into reality.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Phaki Krwele - CEO & Senior Developer */}
          <motion.div
            className="glass-card rounded-2xl p-8 md:p-12 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Profile Image */}
              <div className="lg:col-span-1">
                <div className="relative">
                  <div className="w-64 h-64 mx-auto bg-gradient-to-br from-[#00E5FF] to-[#E53935] rounded-full p-1 mb-6">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <img 
                        src="/Meet-the-team-media/CEO-PK.jpeg" 
                        alt="Phaki Krwele - CEO & Senior Developer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Floating Icons */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-[#00E5FF] to-[#0066CC] rounded-full flex items-center justify-center"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Code2 className="w-6 h-6 text-white" />
                  </motion.div>
                  
                  <motion.div
                    className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-[#E53935] to-[#FF6B6B] rounded-full flex items-center justify-center"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Heart className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-3xl md:text-4xl font-bold mb-4 font-orbitron text-[#EAEAEA]">
                    Phaki Krwele
                  </h3>
                  <p className="text-xl text-[#00E5FF] mb-6 font-semibold">
                    CEO & Senior Developer
                  </p>

                  {/* Quote */}
                  <div className="bg-[#1C1F27]/50 border-l-4 border-[#00E5FF] p-6 mb-8 rounded-r-lg">
                    <Quote className="w-8 h-8 text-[#00E5FF] mb-4" />
                    <p className="text-[#EAEAEA]/80 text-lg italic leading-relaxed">
                      "I'm not trying to win awards. I just want to build stuff that doesn't make 
                      people want to throw their computer out the window."
                    </p>
                  </div>

                  {/* Story */}
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#00E5FF] to-[#0066CC] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Laptop className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-[#EAEAEA] mb-2">The Scrappy Beginning</h4>
                        <p className="text-[#EAEAEA]/70 leading-relaxed">
                          Meet Phaki – the guy who started coding because he had to, not because it was trendy. 
                          Growing up without much, he discovered that a laptop and an internet connection could be 
                          his ticket to something better. What began as a desperate attempt to change his circumstances 
                          turned into a genuine love affair with problem-solving through code.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#E53935] to-[#FF6B6B] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-[#EAEAEA] mb-2">Design That Actually Makes Sense</h4>
                        <p className="text-[#EAEAEA]/70 leading-relaxed">
                          Phaki starts every project by asking the questions that matter: Who's actually going to use this? 
                          What problem are we really solving? And please, for the love of all that's good – will my grandmother 
                          be able to figure this out? This isn't about dumbing things down. It's about being smart enough 
                          to make complex things feel simple.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#00E5FF] to-[#E53935] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-[#EAEAEA] mb-2">Building Stuff That Actually Matters</h4>
                        <p className="text-[#EAEAEA]/70 leading-relaxed">
                          Phaki has this thing where he can't help but care about the projects he takes on. 
                          He's worked with everyone – from the teacher trying to manage her classroom better to the 
                          small business owner who just wants to stop losing sleep over inventory. The problems are 
                          different, but Phaki's approach is always the same: listen first, assume nothing, and 
                          build something that actually works in the real world.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#FF6B6B] to-[#00E5FF] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-[#EAEAEA] mb-2">The Bigger Picture</h4>
                        <p className="text-[#EAEAEA]/70 leading-relaxed">
                          "I want to look back in ten years and know that we didn't just build good software," 
                          Phaki explains. "I want to know that we built better opportunities for people who needed them." 
                          He's talking about opening doors, mentoring kids who remind him of himself, and creating 
                          programs where young people can learn real skills and build real things.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="mt-8 p-6 bg-gradient-to-r from-[#00E5FF]/10 to-[#E53935]/10 rounded-lg border border-[#00E5FF]/20">
                    <p className="text-[#EAEAEA]/80 mb-4">
                      <strong>What This Actually Means for You:</strong> When you work with NaniTech, you're not just hiring developers. 
                      You're partnering with someone who's been there, who understands that behind every technical requirement 
                      is a real person trying to solve a real problem.
                    </p>
                    <div className="flex items-center space-x-2 text-[#00E5FF]">
                      <Coffee className="w-5 h-5" />
                      <span className="text-sm font-semibold">Got a project that could use someone who actually cares about getting it right? Let's talk.</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Team Values */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="glass-card p-6 rounded-xl text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#00E5FF] to-[#0066CC] rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-[#EAEAEA] mb-3 font-orbitron">
                Genuine Care
              </h4>
              <p className="text-[#EAEAEA]/70">
                We don't just build software – we build solutions that make a real difference in people's lives.
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#E53935] to-[#FF6B6B] rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-[#EAEAEA] mb-3 font-orbitron">
                Simple Solutions
              </h4>
              <p className="text-[#EAEAEA]/70">
                Complex problems deserve elegant solutions. We make the complicated feel simple and intuitive.
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#00E5FF] to-[#E53935] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-[#EAEAEA] mb-3 font-orbitron">
                Real Impact
              </h4>
              <p className="text-[#EAEAEA]/70">
                Every project we take on has the potential to change someone's world for the better.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MeetTheTeam;
