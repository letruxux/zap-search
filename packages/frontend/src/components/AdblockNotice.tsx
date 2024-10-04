import { useEffect, useState } from "react";

const useDetectAdBlock = () => {
  const [adBlockDetected, setAdBlockDetected] = useState(false);
  useEffect(() => {
    const url = "https://www3.doubleclick.net";
    fetch(url, {
      method: "HEAD",
      mode: "no-cors",
      cache: "no-store",
    })
      .then(({ redirected }) => {
        if (redirected) setAdBlockDetected(true);
      })
      .catch(() => {
        setAdBlockDetected(true);
      });
  }, []);
  return adBlockDetected;
};

const shortlinkBypassUserscriptUrl =
  "https://codeberg.org/Amm0ni4/bypass-all-shortlinks-debloated/raw/branch/main/Bypass_All_Shortlinks.user.js";
const ublockUrl = "https://github.com/gorhill/uBlock#installation";
const violentMonkeyUrl = "https://violentmonkey.github.io/get-it/";

const text = (
  <>
    Hey! The sites you may encounter using this search engine may contain fake download
    links, obtrusive ads and pop-ups. Please use an{" "}
    <a className="link" href={ublockUrl}>
      ad-blocker
    </a>{" "}
    and a{" "}
    <a className="link" href={violentMonkeyUrl}>
      user script manager
    </a>{" "}
    with a{" "}
    <a className="link" href={shortlinkBypassUserscriptUrl}>
      shortlink bypasser
    </a>{" "}
    to avoid these issues. You have been warned!
  </>
);

const setAdblockModalClosed = () => localStorage.setItem("adblockModalClosed", "1");
const getAdblockModalClosed = () => localStorage.getItem("adblockModalClosed") === "1";

export const openModal = () =>
  (document.getElementById("adblockmodal") as HTMLDialogElement | undefined)?.showModal();

export const closeModal = () =>
  (document.getElementById("adblockmodal") as HTMLDialogElement | undefined)?.close();

export default function AdblockNotice() {
  const adBlockDetected = useDetectAdBlock();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (adBlockDetected && !getAdblockModalClosed()) {
      openModal();
    }
  }, [adBlockDetected]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleClose = () => {
    setAdblockModalClosed();
    closeModal();
  };

  return (
    <dialog id="adblockmodal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Warning!</h3>
        <p className="py-4 text-justify">{text}</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn" disabled={countdown > 0} onClick={handleClose}>
              {countdown > 0 ? `Close (${countdown})` : "Close"}
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
