type SiteFooterProps = { name: string };

export default function SiteFooter({ name }: SiteFooterProps) {
  return <footer className="footer" style={{ marginTop: 'auto' }}><div className="container"><p className="footer-text">Designed &amp; Built by <span>{name}</span> &copy; {new Date().getFullYear()}</p></div></footer>;
}
