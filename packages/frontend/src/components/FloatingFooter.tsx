import { openModal } from "./AdblockNotice";

export default function FloatingFooter() {
  return (
    <footer className="fixed bottom-4 left-0 w-full flex justify-center text-sm">
      <div className="bg-base-100 p-2 rounded-xl shadow-lg flex items-center justify-center transition-all bg-opacity-95 hover:bg-opacity-50">
        <span
          onClick={() => openModal()}
          className="link hover:opacity-90 transition-opacity font-bold"
        >
          Before using...
        </span>
        <span className="mr-1 ml-1">•</span>
        <a
          href="https://github.com/letruxux/zap-search"
          target="_blank"
          className="link hover:opacity-90 transition-opacity"
        >
          GitHub
        </a>
        <span className="mr-1 ml-1">•</span>
        <a
          href="https://reddit.com/r/Piracy"
          target="_blank"
          className="link hover:opacity-90 transition-opacity"
        >
          r/Piracy
        </a>
        <span className="mr-1 ml-1">•</span>
        <a
          href="https://ko-fi.com/letruxux"
          target="_blank"
          className="link hover:opacity-90 transition-opacity text-yellow-500"
        >
          Donate
        </a>
      </div>
    </footer>
  );
}
