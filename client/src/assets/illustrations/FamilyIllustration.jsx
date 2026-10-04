import { Float } from '../../components/motion/Float.jsx';
import { FEATHERS, DOVE_BODY, DOVE_BEAK, WING_PIVOT } from './feathers.js';

/** Abstract parent and child holding hands, with the dove overhead. Decorative. */
export function FamilyIllustration({ className }) {
  return (
    <svg className={className} viewBox="0 0 480 440" role="presentation" aria-hidden="true" focusable="false">
      <path d="M 40 300 C 40 160 150 60 270 70 C 390 80 450 170 440 280 C 430 380 340 420 240 416 C 120 412 40 400 40 300 Z" fill="var(--dawn)" />
      <ellipse cx="252" cy="394" rx="176" ry="22" fill="var(--navy-tint)" />
      <Float distance={10} duration={8}>
        <circle cx="380" cy="120" r="34" fill="var(--sun)" />
      </Float>

      {/* Hands, drawn behind bodies */}
      <path d="M 232 300 C 262 336 290 336 316 318" fill="none" stroke="var(--navy-deep)" strokeWidth="14" strokeLinecap="round" />

      {/* Parent */}
      <path d="M 150 392 C 146 300 160 214 200 206 C 240 214 254 300 250 392 Z" fill="var(--navy)" />
      <circle cx="200" cy="164" r="36" fill="var(--navy)" />

      {/* Child */}
      <path d="M 288 392 C 286 340 296 290 322 286 C 348 290 358 340 356 392 Z" fill="var(--orange)" />
      <circle cx="322" cy="254" r="26" fill="var(--orange)" />

      {/* Small dove overhead */}
      <Float distance={8} duration={6} delay={0.8}>
        <g transform="translate(250 50) scale(0.26)">
          <g transform={`translate(${WING_PIVOT.x} ${WING_PIVOT.y})`}>
            {FEATHERS.map((f, i) => (
              <path key={i} d={f.d} fill={f.color} transform={`rotate(${f.rotate})`} />
            ))}
          </g>
          <path d={DOVE_BODY} fill="var(--white)" stroke="var(--navy)" strokeWidth="12" strokeLinejoin="round" />
          <path d={DOVE_BEAK} fill="var(--orange)" stroke="var(--navy)" strokeWidth="8" strokeLinejoin="round" />
        </g>
      </Float>
    </svg>
  );
}
