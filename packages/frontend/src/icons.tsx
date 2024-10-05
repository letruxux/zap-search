import { Action } from "shared/defs";
import { ClassNameValue, twMerge } from "tailwind-merge";

interface IconProps {
  cn?: ClassNameValue;
}

export function SearchIcon({ cn }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={twMerge("h-4 w-4 opacity-70", cn)}
    >
      <path
        fillRule="evenodd"
        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function DownloadIcon({ cn }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={twMerge("h-5 w-5 ml-2", cn)}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function WatchIcon({ cn }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={twMerge("h-5 w-5", cn)}
      viewBox="0 0 512 512"
    >
      <path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9l0 176c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z" />
    </svg>
  );
}

export function ReadIcon({ cn }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={twMerge("h-5 w-5", cn)}
      viewBox="0 0 448 512"
    >
      <path d="M96 0C43 0 0 43 0 96L0 416c0 53 43 96 96 96l288 0 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-64c17.7 0 32-14.3 32-32l0-320c0-17.7-14.3-32-32-32L384 0 96 0zm0 384l256 0 0 64L96 448c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16zm16 48l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
    </svg>
  );
}

export function TorrentIcon({ cn }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1333.33 1333.3"
      className={twMerge("h-5 w-5", cn)}
    >
      <path
        fillRule="nonzero"
        fill="currentColor"
        d="m855.49,1009.95c69.98,-37.48 122.15,-99.34 181.82,-150.27c84.04,20.31 169.64,32.49 255.87,38.11c-95.6,219.63 -295.86,389.89 -532.98,435.51c-63.73,-93.09 -104.03,-199.01 -135.27,-306.78c76.85,-0.32 156.83,9.68 230.56,-16.56l0,-0.01zm-854.46,-373.95c14.06,-349.91 345.22,-657.32 697,-634.83c374.26,14.37 697.31,393.02 625.14,767.29c-60.29,-0.62 -120.27,-22.8 -153.08,-76.23c-87.16,-131.52 -127.15,-287.41 -206.5,-423.32c-56.87,9.06 -113.41,20 -169.64,32.49c21.56,152.77 117.46,280.54 152.77,428.94c-16.25,129.66 -179.33,202.45 -291.8,142.15c-93.41,-35.93 -131.84,-135.59 -164.33,-221.81c-31.24,-89.97 -66.54,-178.7 -114.03,-261.49c-72.17,-1.56 -146.52,0.63 -211.81,35.62c58.73,300.85 223.37,568.9 291.48,867.26c-271.81,-86.86 -472.38,-369.28 -455.19,-656.07l-0.01,0z"
      />
    </svg>
  );
}

export const icons: Record<Action, JSX.Element> = {
  Download: <DownloadIcon />,
  Watch: <WatchIcon />,
  Read: <ReadIcon />,
};
