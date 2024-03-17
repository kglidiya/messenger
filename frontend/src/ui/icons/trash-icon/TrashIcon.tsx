import styles from "./TrashIcone.module.css";

interface ITrashIconProps {
  width: number;
  height: number;
  onClick: VoidFunction;
  bottom?: number;
  top?: number;
  left?: number;
  right?: number;
}
export default function TrashIcon({ width, height, bottom, top, left, right, onClick }: ITrashIconProps) {
  return (
    <div
      className={styles.icon}
      onClick={onClick}
      style={{
        bottom: `${bottom}px`,
        top: `${top}px`,
        left: `${left}px`,
        right: `${right}px`,
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox='-3 0 32 32'
        version='1.1'
        xmlns='http://www.w3.org/2000/svg'
        fill='#000000'
      >
        <g id='SVGRepo_bgCarrier' strokeWidth='0' />

        <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round' />

        <g id='SVGRepo_iconCarrier'>
          {" "}
          <title>trash</title> <desc>Created with Sketch Beta.</desc> <defs> </defs>{" "}
          <g id='Page-1' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
            {" "}
            <g id='Icon-Set-Filled' transform='translate(-261.000000, -205.000000)' fill='#ddd6c7'>
              {" "}
              <path
                d='M268,220 C268,219.448 268.448,219 269,219 C269.552,219 270,219.448 270,220 L270,232 C270,232.553 269.552,233 269,233 C268.448,233 268,232.553 268,232 L268,220 L268,220 Z M273,220 C273,219.448 273.448,219 274,219 C274.552,219 275,219.448 275,220 L275,232 C275,232.553 274.552,233 274,233 C273.448,233 273,232.553 273,232 L273,220 L273,220 Z M278,220 C278,219.448 278.448,219 279,219 C279.552,219 280,219.448 280,220 L280,232 C280,232.553 279.552,233 279,233 C278.448,233 278,232.553 278,232 L278,220 L278,220 Z M263,233 C263,235.209 264.791,237 267,237 L281,237 C283.209,237 285,235.209 285,233 L285,217 L263,217 L263,233 L263,233 Z M277,209 L271,209 L271,208 C271,207.447 271.448,207 272,207 L276,207 C276.552,207 277,207.447 277,208 L277,209 L277,209 Z M285,209 L279,209 L279,207 C279,205.896 278.104,205 277,205 L271,205 C269.896,205 269,205.896 269,207 L269,209 L263,209 C261.896,209 261,209.896 261,211 L261,213 C261,214.104 261.895,214.999 262.999,215 L285.002,215 C286.105,214.999 287,214.104 287,213 L287,211 C287,209.896 286.104,209 285,209 L285,209 Z'
                id='trash'
              >
                {" "}
              </path>{" "}
            </g>{" "}
          </g>{" "}
        </g>
      </svg>
      {/* <svg
        width={width}
        height={height}
        viewBox='-3 0 32 32'
        version='1.1'
        xmlns='http://www.w3.org/2000/svg'
        fill='#000000'
      >
        <g id='SVGRepo_bgCarrier' strokeWidth='0' />

        <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round' />

        <g id='SVGRepo_iconCarrier'>
          {" "}
          <title>trash</title> <desc>Created with Sketch Beta.</desc> <defs> </defs>{" "}
          <g id='Page-1' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
            {" "}
            <g id='Icon-Set' transform='translate(-259.000000, -203.000000)' fill='#ddd6c7'>
              {" "}
              <path
                d='M282,211 L262,211 C261.448,211 261,210.553 261,210 C261,209.448 261.448,209 262,209 L282,209 C282.552,209 283,209.448 283,210 C283,210.553 282.552,211 282,211 L282,211 Z M281,231 C281,232.104 280.104,233 279,233 L265,233 C263.896,233 263,232.104 263,231 L263,213 L281,213 L281,231 L281,231 Z M269,206 C269,205.447 269.448,205 270,205 L274,205 C274.552,205 275,205.447 275,206 L275,207 L269,207 L269,206 L269,206 Z M283,207 L277,207 L277,205 C277,203.896 276.104,203 275,203 L269,203 C267.896,203 267,203.896 267,205 L267,207 L261,207 C259.896,207 259,207.896 259,209 L259,211 C259,212.104 259.896,213 261,213 L261,231 C261,233.209 262.791,235 265,235 L279,235 C281.209,235 283,233.209 283,231 L283,213 C284.104,213 285,212.104 285,211 L285,209 C285,207.896 284.104,207 283,207 L283,207 Z M272,231 C272.552,231 273,230.553 273,230 L273,218 C273,217.448 272.552,217 272,217 C271.448,217 271,217.448 271,218 L271,230 C271,230.553 271.448,231 272,231 L272,231 Z M267,231 C267.552,231 268,230.553 268,230 L268,218 C268,217.448 267.552,217 267,217 C266.448,217 266,217.448 266,218 L266,230 C266,230.553 266.448,231 267,231 L267,231 Z M277,231 C277.552,231 278,230.553 278,230 L278,218 C278,217.448 277.552,217 277,217 C276.448,217 276,217.448 276,218 L276,230 C276,230.553 276.448,231 277,231 L277,231 Z'
                id='trash'
              >
                {" "}
              </path>{" "}
            </g>{" "}
          </g>{" "}
        </g>
      </svg> */}
    </div>
  );
}
