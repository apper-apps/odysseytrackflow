import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const FloatingActionButton = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white rounded-full shadow-fab hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
    >
      <ApperIcon 
        name="Plus" 
        className="w-6 h-6 transition-transform duration-200 group-hover:rotate-90" 
      />
    </motion.button>
  );
};

export default FloatingActionButton;