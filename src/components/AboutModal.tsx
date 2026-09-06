import { ArrowLeft, Download } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { portfolioData } from '../portfolioData';

type AboutModalProps = { person: typeof portfolioData.person; open: boolean; onClose: () => void };

export default function AboutModal({ person, open, onClose }: AboutModalProps) {
  return (
    <AnimatePresence>
      {open && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }} className="about-modal-overlay" onClick={onClose}>
        <button className="about-modal-back-btn" onClick={(event) => { event.stopPropagation(); onClose(); }}><ArrowLeft size={16} /><span>Back</span></button>
        <motion.div initial={{ scale: 0.96, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 24 }} transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }} className="about-modal-container" onClick={(event) => event.stopPropagation()}>
          <h2 className="about-modal-title">About Me <span className="about-modal-cursor">|</span></h2>
          <div className="about-modal-text-container"><p className="about-modal-paragraph">{person.about}</p></div>
          <a href={person.resume.url} download={person.resume.filename} className="about-modal-download-btn"><Download size={16} /><span>Download Resume</span></a>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  );
}
