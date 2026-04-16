import { useState } from 'react';

const Hero = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #0a0a0f 0%, #12101a 60%, #1a0f0f 100%)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Georgia', serif",
        padding: '0 6vw',
      }}
    >
      {/* Grain texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          opacity: 0.4,
          pointerEvents: 'none',
        }}
      />

      {/* Large decorative index number */}
      <span
        style={{
          position: 'absolute',
          top: '-0.15em',
          right: '4vw',
          fontSize: 'clamp(180px, 28vw, 380px)',
          fontWeight: 900,
          lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: '1.5px rgba(255,255,255,0.06)',
          letterSpacing: '-0.04em',
          userSelect: 'none',
          fontFamily: "'Georgia', serif",
        }}
      >
        01
      </span>

      {/* Top nav row */}
      <div
        style={{
          position: 'absolute',
          top: '2.5rem',
          left: '6vw',
          right: '6vw',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            color: '#e8d5b0',
            fontSize: '13px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 500,
          }}
        >
          Forma Studio
        </span>
        <nav style={{ display: 'flex', gap: '2.5rem' }}>
          {['Work', 'About', 'Contact'].map((item) => (
            <a
              key={item}
              href="#"
              style={{
                color: 'rgba(232,213,176,0.5)',
                fontSize: '12px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                fontFamily: 'system-ui, sans-serif',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.color = '#e8d5b0')}
              onMouseLeave={(e) => (e.target.style.color = 'rgba(232,213,176,0.5)')}
            >
              {item}
            </a>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px' }}>
        {/* Eyebrow */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2.5rem',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '1px',
              background: 'linear-gradient(90deg, #c9a96e, transparent)',
            }}
          />
          <span
            style={{
              color: '#c9a96e',
              fontSize: '11px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 600,
            }}
          >
            Creative Direction · Brand Identity
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: 'clamp(52px, 9.5vw, 132px)',
            fontWeight: 400,
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            color: '#f0e8d8',
            margin: 0,
            marginBottom: '1.5rem',
          }}
        >
          We shape
          <br />
          <em
            style={{
              fontStyle: 'italic',
              color: '#c9a96e',
            }}
          >
            ideas
          </em>{' '}
          into
          <br />
          experiences.
        </h1>

        {/* Sub-row: description + CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '3rem',
            marginTop: '3.5rem',
            flexWrap: 'wrap',
          }}
        >
          <p
            style={{
              color: 'rgba(240,232,216,0.45)',
              fontSize: 'clamp(15px, 1.6vw, 18px)',
              lineHeight: 1.65,
              maxWidth: '380px',
              margin: 0,
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 300,
            }}
          >
            A boutique studio crafting bold visual identities and digital experiences for brands that refuse to blend in.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
            <button
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{
                background: hovered ? '#c9a96e' : 'transparent',
                color: hovered ? '#0a0a0f' : '#e8d5b0',
                border: '1px solid #c9a96e',
                padding: '1rem 2.5rem',
                fontSize: '12px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.25s, color 0.25s',
              }}
            >
              View Our Work
            </button>
            <span
              style={{
                color: 'rgba(201,169,110,0.5)',
                fontSize: '11px',
                letterSpacing: '0.15em',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              ↓ 47 projects delivered in 2024
            </span>
          </div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '6vw',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <div
          style={{
            width: '1px',
            height: '40px',
            background: 'linear-gradient(180deg, #c9a96e, transparent)',
          }}
        />
        <span
          style={{
            color: 'rgba(201,169,110,0.4)',
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontFamily: 'system-ui, sans-serif',
            writingMode: 'vertical-rl',
          }}
        >
          Scroll
        </span>
      </div>
    </section>
  );
};

export default Hero;
