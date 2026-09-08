type SiteFooterProps = { name: string };

export default function SiteFooter({ name }: SiteFooterProps) {
  return (
    <footer className="footer" style={{ marginTop: 'auto' }}>
      <span className="footer-wordmark" aria-hidden="true">DHRUV</span>
      <div className="container footer-content">
        <p className="footer-text">Designed &amp; Built by <span>{name}</span> &copy; {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
