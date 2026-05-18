/* eslint-disable */
/* Hero — reused across pages. Pass overrides via props. */
function Hero({ tag, title, subtitle, star, body, pills }) {
  const D = window.DOCKEASY;
  return (
    <div className="hero" id="top">
      <div className="hero-tag">{tag || D.BRAND.version}</div>
      <h1>{D.BRAND.prefix}<em>{title || D.BRAND.wordmark}</em></h1>
      <p className="hero-subtitle">{subtitle || D.BRAND.tagline}</p>
      <p className="hero-star">{star || D.BRAND.star}</p>
      <p className="hero-sub">{body || D.BRAND.description}</p>
      {pills !== false ? (
        <div className="hero-pills">
          {(pills || D.BRAND.pills).map((p, i) => <span className="hero-pill" key={i}>{p}</span>)}
        </div>
      ) : null}
    </div>
  );
}
Object.assign(window, { Hero });
