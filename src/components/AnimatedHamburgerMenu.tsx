import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ArrowRight
} from 'lucide-react';
import IconScout3DIcon from '@/components/IconScout3DIcon';

interface AnimatedHamburgerMenuProps {
  className?: string;
}

const AnimatedHamburgerMenu: React.FC<AnimatedHamburgerMenuProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      category: 'Platform',
      items: [
        { name: 'Code Editor', iconQuery: 'code editor 3d', path: '/editor', description: 'Advanced code editor with AI assistance' },
        { name: 'AI Assistant', iconQuery: 'ai assistant robot 3d', path: '/ai-assistant', description: 'Intelligent coding companion' },
        { name: 'Features', iconQuery: 'features settings 3d', path: '/features', description: 'Explore all platform features' },
        { name: 'Pricing', iconQuery: 'pricing money 3d', path: '/pricing', description: 'Choose your plan' },
      ]
    },
    {
      category: 'Learning',
      items: [
        { name: 'Courses', iconQuery: 'courses education 3d', path: '/courses', description: 'Structured learning paths' },
        { name: 'Data Structures & Algorithms', iconQuery: 'data structures algorithms 3d', path: '/courses/data-structures-algorithms', description: 'Master DSA concepts' },
        { name: 'Web Development', iconQuery: 'web development 3d', path: '/courses/web-development', description: 'Full-stack web development' },
        { name: 'Python Programming', iconQuery: 'python programming 3d', path: '/courses', description: 'Learn Python from scratch' },
        { name: 'Full-Stack Development', iconQuery: 'full stack development 3d', path: '/courses', description: 'Complete development skills' },
      ]
    },
    {
      category: 'Resources',
      items: [
        { name: 'Documentation', iconQuery: 'documentation book 3d', path: '/documentation', description: 'Comprehensive guides' },
        { name: 'Community', iconQuery: 'community users 3d', path: '/community', description: 'Connect with developers' },
        { name: 'Blog', iconQuery: 'blog writing 3d', path: '/blog', description: 'Latest insights and tutorials' },
        { name: 'Help Center', iconQuery: 'help support 3d', path: '/help', description: 'Get support and answers' },
        { name: 'Templates', iconQuery: 'templates design 3d', path: '/templates', description: 'Ready-to-use code templates' },
      ]
    },
    {
      category: 'Company',
      items: [
        { name: 'About Us', iconQuery: 'about company 3d', path: '/about', description: 'Learn about our mission' },
        { name: 'Careers', iconQuery: 'careers job 3d', path: '/careers', description: 'Join our team' },
        { name: 'Contact', iconQuery: 'contact phone 3d', path: '/contact', description: 'Get in touch' },
        { name: 'Privacy Policy', iconQuery: 'privacy security 3d', path: '/privacy-policy', description: 'Your privacy matters' },
      ]
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Hamburger Button - Smaller */}
      <motion.button
        onClick={toggleMenu}
        className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-300 backdrop-blur-sm border border-white/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="relative w-5 h-5"
          animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Top Line */}
          <motion.div
            className="absolute top-0.5 left-0 w-5 h-0.5 bg-white rounded-full"
            animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
          {/* Middle Line */}
          <motion.div
            className="absolute top-2.5 left-0 w-5 h-0.5 bg-white rounded-full"
            animate={isOpen ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
          {/* Bottom Line */}
          <motion.div
            className="absolute top-4.5 left-0 w-5 h-0.5 bg-white rounded-full"
            animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Compact Menu Panel - Not Full Screen */}
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-xl z-50 rounded-2xl border border-white/20 shadow-2xl"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Close Button */}
              <motion.button
                className="absolute top-4 right-4 w-8 h-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 z-10"
                onClick={() => setIsOpen(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-4 h-4" />
              </motion.button>

              {/* Compact Menu Content */}
              <motion.div
                className="w-full max-w-4xl mx-auto p-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                {/* Menu Header - Smaller */}
                <div className="text-center mb-8">
                  <motion.h2
                    className="brand-text text-2xl md:text-3xl mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    Explore CodeFusionAI
                  </motion.h2>
                  <motion.p
                    className="text-white/70 text-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    Discover all the powerful features and resources we offer
                  </motion.p>
                </div>

                {/* Compact Menu Grid - 2 columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {menuItems.map((category, categoryIndex) => (
                    <motion.div
                      key={category.category}
                      className="space-y-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + (categoryIndex * 0.1) }}
                    >
                      {/* Category Header - Smaller */}
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-400/30 rounded-xl mb-2">
                          <IconScout3DIcon
                            query={
                              category.category === 'Platform' ? 'platform rocket 3d' :
                              category.category === 'Learning' ? 'learning education 3d' :
                              category.category === 'Resources' ? 'resources tools 3d' :
                              'company business 3d'
                            }
                            size="md"
                            className="w-6 h-6"
                            fallback={
                              <div className="text-lg">
                                {category.category === 'Platform' && '🚀'}
                                {category.category === 'Learning' && '📚'}
                                {category.category === 'Resources' && '🔧'}
                                {category.category === 'Company' && '🏢'}
                              </div>
                            }
                          />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">{category.category}</h3>
                        <div className="w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto"></div>
                      </div>
                      
                      {/* Category Items - Compact */}
                      <div className="space-y-2">
                        {category.items.map((item, itemIndex) => (
                          <motion.button
                            key={item.name}
                            onClick={() => handleNavigation(item.path)}
                            className="w-full group relative overflow-hidden"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 + (categoryIndex * 0.1) + (itemIndex * 0.03) }}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/20">
                              <div className="flex items-center gap-3">
                                {/* IconScout 3D Icon - Smaller */}
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                  <IconScout3DIcon
                                    query={item.iconQuery}
                                    size="sm"
                                    className="w-5 h-5"
                                    fallback={
                                      <div className="text-sm">
                                        {item.name === 'Code Editor' && '💻'}
                                        {item.name === 'AI Assistant' && '🤖'}
                                        {item.name === 'Features' && '⚡'}
                                        {item.name === 'Pricing' && '💰'}
                                        {item.name === 'Courses' && '🎓'}
                                        {item.name === 'Data Structures & Algorithms' && '📊'}
                                        {item.name === 'Web Development' && '🌐'}
                                        {item.name === 'Python Programming' && '🐍'}
                                        {item.name === 'Full-Stack Development' && '🔗'}
                                        {item.name === 'Documentation' && '📖'}
                                        {item.name === 'Community' && '👥'}
                                        {item.name === 'Blog' && '📝'}
                                        {item.name === 'Help Center' && '❓'}
                                        {item.name === 'Templates' && '📋'}
                                        {item.name === 'About Us' && 'ℹ️'}
                                        {item.name === 'Careers' && '💼'}
                                        {item.name === 'Contact' && '📞'}
                                        {item.name === 'Privacy Policy' && '🔒'}
                                      </div>
                                    }
                                  />
                                </div>
                                
                                <div className="flex-1 text-left">
                                  <div className="text-white font-semibold group-hover:text-cyan-400 transition-colors text-xs mb-0.5">
                                    {item.name}
                                  </div>
                                  <div className="text-xs text-white/60 group-hover:text-white/80 transition-colors line-clamp-1">
                                    {item.description}
                                  </div>
                                </div>

                                {/* Arrow Icon - Smaller */}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer - Smaller */}
                <motion.div
                  className="text-center mt-8 pt-4 border-t border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <p className="text-white/60 text-xs">
                    Ready to start your coding journey? 
                    <span className="text-cyan-400 font-semibold ml-1">Let's build something amazing together!</span>
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedHamburgerMenu;
