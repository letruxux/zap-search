export default function FloatingFooter() {
  return (
    <footer className="fixed bottom-4 left-0 w-full p-2 flex justify-center text-sm">
      <a
        href="https://github.com/letruxux/zap-search"
        target="_blank"
        className="link hover:opacity-90 transition-opacity"
      >
        Github
      </a>
      <span className="mr-1 ml-1">•</span>
      <a
        href="https://ko-fi.com/letruxux"
        target="_blank"
        className="link hover:opacity-90 transition-opacity"
      >
        Donate
      </a>
    </footer>
  );
}
