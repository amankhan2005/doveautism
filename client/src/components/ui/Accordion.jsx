import { useId, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import styles from './Accordion.module.css';

/** Accessible disclosure list. items: [{ question, answer }] */
export function Accordion({ items, headingLevel = 3 }) {
  const [open, setOpen] = useState(0);
  const baseId = useId();
  const Heading = `h${headingLevel}`;

  return (
    <div className={styles.list}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const buttonId = `${baseId}-b${i}`;
        const panelId = `${baseId}-p${i}`;
        return (
          <div key={item.question} className={`${styles.item} ${isOpen ? styles.open : ''}`}>
            <Heading className={styles.heading}>
              <button
                id={buttonId}
                type="button"
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span>{item.question}</span>
                <m.span className={styles.chevron} animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }} aria-hidden="true">
                  <ChevronDown strokeWidth={2} />
                </m.span>
              </button>
            </Heading>
            <AnimatePresence initial={false}>
              {isOpen && (
                <m.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={styles.panel}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className={styles.answer}>{item.answer}</p>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
