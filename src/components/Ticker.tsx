import type { portfolioData } from '../portfolioData';

type TickerProps = { person: typeof portfolioData.person };

export default function Ticker({ person }: TickerProps) {
  const items = [
    person.name,
    `${person.headline[0]} Developer`,
    `${person.headline[1].replace('& ', '')} ${person.headline[2]}`,
    `${person.specialties[0]} & ${person.specialties[4]}`,
    `${person.specialties[2]} & ${person.specialties[3]}`,
    'FastAPI'
  ];

  return (
    <div className="ticker-wrap">
      <div className="ticker">
        {[false, true].map((hidden) => (
          <div key={String(hidden)} className="ticker-item-group" aria-hidden={hidden || undefined}>
            {items.map((item, index) => (
              <span key={`${item}-${index}`} className="ticker-item">{index === 2 ? <span className="accent">{item}</span> : item}<span className="ticker-dot">✦</span></span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
