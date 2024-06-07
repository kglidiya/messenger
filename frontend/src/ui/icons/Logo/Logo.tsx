import styles from "./Logo.module.css";

interface ILogoProps {
  color: string;
  width: number;
  height: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}
export default function Logo({ color, width, height, top, bottom, left, right }: ILogoProps) {
  return (
    <div
      className={styles.wrapper}
      style={{
        top: `${top}px`,
        bottom: `${bottom}px`,
        left: `${left}px`,
        right: `${right}px`,
      }}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width={`${width}px`}
        height={`${height}px`}
        viewBox='0 0 100 100'
        version='1.1'
        fill={color}
      >
        <g id='surface1'>
          <path d='M 34.070312 6.699219 C 32.636719 8.078125 31.242188 10.710938 30.75 12.988281 C 30.527344 14.03125 30.449219 16.054688 30.566406 17.84375 C 30.625 18.859375 30.5 18.9375 29.890625 18.25 C 29.394531 17.695312 28.171875 16.816406 28.054688 16.933594 C 27.910156 17.078125 27.742188 18.789062 27.742188 20.234375 C 27.734375 22.03125 27.949219 23.515625 28.417969 24.851562 C 28.828125 26.035156 28.859375 26.171875 28.691406 26.171875 C 28.625 26.171875 27.832031 25.449219 26.953125 24.5625 C 26.074219 23.671875 25.320312 22.976562 25.273438 23.027344 C 25.1875 23.117188 25.617188 28.125 25.789062 29.042969 C 25.984375 30.097656 26.960938 32.070312 27.949219 33.417969 C 28.40625 34.042969 28.613281 34.21875 28.613281 33.984375 C 28.613281 33.925781 28.367188 33.476562 28.078125 32.976562 C 27.480469 31.984375 26.835938 30.4375 26.609375 29.453125 C 26.269531 27.988281 26.230469 26.074219 26.542969 26.074219 C 26.621094 26.074219 27.382812 26.796875 28.242188 27.675781 C 29.09375 28.5625 30.046875 29.453125 30.359375 29.667969 C 31.007812 30.097656 32.195312 30.625 32.296875 30.527344 C 32.335938 30.5 32.246094 30 32.101562 29.421875 C 31.90625 28.652344 31.671875 28.039062 31.164062 27.0625 C 30.382812 25.515625 29.96875 24.382812 29.679688 22.921875 C 29.34375 21.257812 29.511719 21.171875 30.410156 22.53125 C 30.75 23.054688 31.164062 23.613281 31.328125 23.757812 C 31.796875 24.210938 32.695312 24.238281 33.105469 23.828125 C 33.378906 23.554688 33.359375 22.988281 33.015625 20.800781 C 32.570312 18 32.492188 17.089844 32.546875 15.527344 C 32.609375 13.945312 32.882812 12.65625 33.390625 11.554688 C 33.828125 10.617188 33.90625 10.683594 34.277344 12.351562 C 34.570312 13.632812 35.039062 14.96875 35.644531 16.25 C 36.476562 18 36.84375 18.585938 40.546875 24.023438 C 42.648438 27.109375 44.132812 29.796875 44.71875 31.570312 C 45.085938 32.714844 45.632812 34.890625 45.890625 36.28125 C 46.375 38.898438 46.492188 40.8125 46.289062 42.726562 C 46.242188 43.203125 46.210938 43.613281 46.230469 43.632812 C 46.25 43.652344 46.367188 43.25 46.492188 42.753906 C 46.835938 41.347656 46.875 37.988281 46.59375 35.59375 C 46.132812 31.796875 45.527344 29.757812 43.984375 26.765625 C 43.066406 25 42.050781 23.261719 40.929688 21.523438 C 37.859375 16.804688 36.867188 14.757812 36.125 11.621094 C 35.78125 10.195312 35.710938 9.015625 35.878906 7.5 L 35.96875 6.75 L 35.664062 6.453125 C 35.4375 6.230469 35.273438 6.152344 35.007812 6.152344 C 34.707031 6.152344 34.5625 6.242188 34.070312 6.699219 Z M 34.070312 6.699219 ' />
          <path d='M 44.65625 11.367188 C 43.195312 11.492188 42.421875 11.671875 42.695312 11.828125 C 42.765625 11.867188 43.59375 11.945312 44.53125 12 C 51.414062 12.453125 56.679688 13.339844 61.621094 14.902344 C 62.578125 15.203125 62.890625 15.265625 63.769531 15.273438 C 64.6875 15.292969 64.941406 15.34375 66.257812 15.75 C 68.671875 16.515625 69.765625 16.953125 72.023438 18.066406 C 77.246094 20.65625 81.152344 23.4375 85.15625 27.441406 C 90.265625 32.539062 93.769531 37.882812 96.632812 44.921875 C 98.328125 49.121094 99.804688 55.761719 99.804688 59.296875 C 99.804688 59.804688 99.84375 60.15625 99.902344 60.15625 C 100.03125 60.15625 100.03125 58.5625 99.890625 56.960938 C 99.707031 54.707031 99.101562 51.398438 98.378906 48.730469 C 97.101562 43.964844 94.746094 38.835938 91.757812 34.289062 C 89.023438 30.117188 85.148438 25.917969 80.996094 22.597656 C 75.683594 18.359375 68.875 14.921875 62.179688 13.09375 C 59.453125 12.351562 55.683594 11.660156 53.078125 11.425781 C 51.191406 11.257812 46.347656 11.230469 44.65625 11.367188 Z M 44.65625 11.367188 ' />
          <path d='M 4.796875 13.390625 C 4.726562 13.898438 4.640625 14.851562 4.589844 15.527344 C 4.5 16.765625 4.460938 17 4.042969 19.140625 C 3.835938 20.136719 3.796875 20.632812 3.796875 21.84375 C 3.808594 23.886719 4.03125 25.761719 4.445312 27.21875 C 4.8125 28.515625 4.835938 28.613281 4.6875 28.613281 C 4.640625 28.613281 3.679688 28.015625 2.570312 27.285156 C 1.453125 26.542969 0.460938 25.929688 0.371094 25.898438 C 0.15625 25.851562 0.125 26.152344 0.332031 26.308594 C 0.410156 26.367188 0.984375 27.625 1.609375 29.101562 C 2.882812 32.101562 3.5625 33.457031 4.375 34.617188 C 4.992188 35.5 6.640625 37.195312 7.34375 37.6875 C 7.84375 38.015625 7.949219 38.28125 7.609375 38.28125 C 7.492188 38.28125 6.445312 38.066406 5.28125 37.804688 C 1.660156 36.972656 1.289062 36.894531 1.171875 36.933594 C 1.101562 36.953125 1.90625 37.78125 2.9375 38.769531 C 3.984375 39.757812 5.671875 41.386719 6.6875 42.382812 C 8.5625 44.210938 9.796875 45.226562 10.644531 45.65625 C 11.191406 45.929688 11.28125 46.035156 11.101562 46.171875 C 10.945312 46.308594 8.496094 45.996094 7.453125 45.703125 C 7.039062 45.59375 6.035156 45.164062 5.203125 44.765625 C 4.382812 44.355469 3.664062 44.042969 3.601562 44.0625 C 3.496094 44.101562 4.1875 45.085938 5.429688 46.640625 C 6.113281 47.5 8.359375 49.707031 9.863281 50.996094 C 11.296875 52.226562 12.390625 52.890625 13.71875 53.320312 C 14.53125 53.585938 14.941406 53.78125 14.941406 53.90625 C 14.941406 54.015625 13.976562 54.304688 12.84375 54.539062 C 12.414062 54.640625 11.425781 54.734375 10.644531 54.757812 C 9.863281 54.785156 9.1875 54.84375 9.140625 54.890625 C 9.015625 55.007812 10.945312 56.960938 12.15625 57.9375 C 14.65625 59.953125 16.542969 60.734375 20.546875 61.398438 C 20.8125 61.4375 21.046875 61.523438 21.0625 61.582031 C 21.101562 61.699219 19.179688 63.007812 18.730469 63.171875 C 18.585938 63.234375 18.066406 63.367188 17.578125 63.476562 C 17.101562 63.59375 16.699219 63.710938 16.699219 63.730469 C 16.699219 63.820312 19.648438 65.203125 20.265625 65.410156 C 21.699219 65.898438 23.507812 66.171875 24.65625 66.074219 C 25.890625 65.96875 26.953125 65.789062 26.953125 65.695312 C 26.953125 65.644531 26.835938 65.632812 26.6875 65.671875 C 26.296875 65.773438 23.679688 65.734375 22.976562 65.625 C 21.59375 65.398438 19.265625 64.5625 18.898438 64.160156 C 18.730469 63.976562 18.75 63.953125 19.445312 63.632812 C 19.84375 63.4375 20.476562 63.078125 20.867188 62.820312 C 21.765625 62.21875 23.242188 61.054688 23.242188 60.945312 C 23.242188 60.898438 22.742188 60.789062 22.148438 60.703125 C 17.773438 60.046875 15.644531 59.210938 13.183594 57.167969 C 12.265625 56.414062 12.050781 56.171875 12.167969 56.0625 C 12.21875 56.015625 12.695312 55.898438 13.234375 55.8125 C 13.769531 55.722656 14.804688 55.5 15.527344 55.304688 C 17.195312 54.875 18.261719 54.804688 20.019531 55.019531 C 21.171875 55.15625 22.703125 55.332031 24.492188 55.527344 C 24.765625 55.554688 25 55.566406 25 55.539062 C 25 55.390625 19.804688 53.523438 17.207031 52.742188 C 14.84375 52.03125 13.789062 51.621094 12.851562 51.035156 C 12.050781 50.539062 9.617188 48.390625 9.617188 48.183594 C 9.617188 48.054688 10 48.039062 12.0625 48.007812 C 14.421875 47.988281 18.554688 47.792969 18.847656 47.6875 C 18.925781 47.65625 17.859375 47.089844 16.453125 46.398438 C 13.828125 45.109375 12.089844 44.160156 10.859375 43.328125 C 10.058594 42.804688 7.851562 40.644531 7.976562 40.515625 C 8.046875 40.460938 11.503906 40.65625 14.140625 40.867188 C 14.570312 40.90625 14.84375 40.890625 14.84375 40.828125 C 14.84375 40.78125 14.34375 40.382812 13.75 39.953125 C 11.074219 38.046875 7.921875 35.476562 6.933594 34.40625 C 5.839844 33.210938 4.757812 31.53125 4.960938 31.328125 C 5.019531 31.269531 5.371094 31.414062 5.917969 31.726562 C 6.882812 32.285156 7.882812 32.6875 9.953125 33.339844 C 10.90625 33.652344 11.398438 33.757812 11.464844 33.691406 C 11.53125 33.625 11.203125 33.222656 10.4375 32.453125 C 8.164062 30.117188 7.726562 29.601562 7.089844 28.515625 C 6.40625 27.351562 6.015625 26.015625 5.761719 24.023438 C 5.585938 22.578125 5.65625 19.042969 5.867188 19.042969 C 5.90625 19.042969 6.152344 19.367188 6.40625 19.746094 C 8.15625 22.402344 12.296875 26.660156 16.75 30.371094 C 20.058594 33.125 22.492188 34.960938 28.027344 38.886719 C 31.152344 41.09375 32.882812 42.570312 34.296875 44.21875 C 36.542969 46.828125 37.578125 48.90625 38.222656 52.089844 C 38.507812 53.496094 38.625 53.789062 38.523438 52.832031 C 38.039062 48.164062 36.074219 44.511719 32.140625 40.945312 C 30.90625 39.835938 29.523438 38.71875 26.804688 36.671875 C 18.632812 30.488281 13.351562 25.683594 9.316406 20.742188 C 8.117188 19.265625 7.773438 18.671875 6.40625 15.65625 C 5.800781 14.316406 5.214844 13.054688 5.109375 12.851562 L 4.914062 12.46875 Z M 4.796875 13.390625 ' />
          <path d='M 69.773438 18.847656 C 69.6875 18.984375 69.523438 18.859375 71.242188 19.921875 C 77.96875 24.070312 82.910156 28.515625 87.285156 34.335938 C 95.429688 45.195312 98.925781 59.296875 96.621094 72.023438 C 95.945312 75.773438 94.785156 79.492188 93.164062 83.15625 C 92.578125 84.492188 92.226562 85.421875 92.296875 85.5 C 92.480469 85.671875 93.703125 83.808594 94.71875 81.816406 C 96.023438 79.21875 97.011719 76.515625 97.8125 73.339844 L 98.261719 71.53125 L 98.367188 68.3125 C 98.535156 62.804688 98.242188 59.304688 97.207031 54.34375 C 96.386719 50.382812 95 46.375 93.117188 42.53125 C 88.390625 32.871094 80.90625 24.902344 71.484375 19.5 C 70.292969 18.820312 69.890625 18.664062 69.773438 18.847656 Z M 69.773438 18.847656 ' />
          <path d='M 48.195312 46.359375 C 47.285156 46.476562 46.152344 46.960938 45.070312 47.6875 C 44.015625 48.398438 42.148438 50.382812 40.695312 52.34375 C 39.960938 53.339844 39.199219 54.335938 39.015625 54.5625 C 38.652344 54.980469 38.585938 55.273438 38.796875 55.449219 C 39.042969 55.65625 39.433594 55.242188 40.851562 53.339844 C 43.445312 49.84375 45.195312 48.183594 47.167969 47.34375 C 47.804688 47.070312 48.007812 47.03125 48.730469 47.03125 C 50.214844 47.050781 50.996094 47.5 51.914062 48.875 C 52.695312 50.070312 53.390625 50.617188 54.570312 50.96875 C 54.851562 51.054688 55.085938 51.164062 55.085938 51.21875 C 55.085938 51.269531 54.746094 51.375 54.328125 51.445312 C 52.53125 51.75 50.722656 53.078125 49.421875 55.039062 C 48.828125 55.9375 47.625 58.351562 47.128906 59.648438 C 46.933594 60.148438 46.414062 61.601562 45.984375 62.871094 C 44.824219 66.289062 44.289062 67.675781 43.601562 69.09375 C 41.945312 72.492188 39.6875 74.941406 37.179688 76.0625 C 35.304688 76.90625 33.984375 77.128906 29.472656 77.402344 C 28.625 77.453125 28.535156 77.480469 28.613281 77.617188 C 28.671875 77.714844 28.75 80.566406 28.796875 84.226562 C 28.859375 89.257812 28.90625 90.761719 29.015625 91.0625 C 29.21875 91.671875 29.851562 92.246094 30.539062 92.441406 C 31.0625 92.597656 32.949219 92.609375 58.007812 92.617188 C 83.601562 92.625 84.941406 92.617188 85.476562 92.453125 C 86.171875 92.234375 86.726562 91.757812 86.992188 91.125 C 87.195312 90.65625 87.195312 90.617188 87.21875 75.28125 C 87.234375 61.308594 87.21875 59.851562 87.070312 59.25 C 86.671875 57.585938 86.113281 56.992188 84.550781 56.570312 C 83.984375 56.414062 82.617188 56.398438 67.285156 56.347656 C 51.515625 56.296875 50.632812 56.289062 50.605469 56.125 C 50.554688 55.890625 51.476562 54.421875 52.117188 53.710938 C 52.726562 53.046875 53.652344 52.34375 54.316406 52.0625 C 54.804688 51.855469 55.996094 51.582031 56.59375 51.542969 C 56.914062 51.515625 56.992188 51.476562 57.011719 51.296875 C 57.0625 50.984375 56.601562 50.742188 55.742188 50.59375 C 54.375 50.371094 53.273438 49.617188 52.414062 48.320312 C 51.765625 47.351562 51.582031 47.179688 50.890625 46.828125 C 50.070312 46.414062 49.070312 46.242188 48.195312 46.359375 Z M 83.195312 59.316406 C 83.3125 59.453125 83.457031 59.316406 74.0625 67.585938 C 69.53125 71.570312 66.40625 74.304688 64.40625 76.035156 C 60.734375 79.210938 60.585938 79.289062 58.445312 79.296875 C 56.621094 79.296875 55.28125 78.78125 53.339844 77.324219 C 51.503906 75.945312 45.851562 71.375 45.4375 70.9375 L 45.226562 70.703125 L 45.617188 69.84375 C 46.484375 67.96875 46.992188 66.523438 48.4375 61.816406 C 48.90625 60.304688 49.210938 59.460938 49.335938 59.34375 C 49.523438 59.1875 50.46875 59.179688 66.308594 59.179688 C 80.332031 59.179688 83.09375 59.199219 83.195312 59.316406 Z M 84.765625 62.453125 C 84.851562 62.558594 84.875 65.398438 84.824219 75.554688 C 84.785156 82.695312 84.757812 88.585938 84.765625 88.640625 C 84.765625 88.886719 84.382812 88.757812 84.171875 88.445312 C 83.71875 87.820312 79.148438 82.285156 75.605469 78.078125 C 73.339844 75.390625 71.972656 73.703125 71.972656 73.574219 C 71.972656 73.417969 72.421875 72.96875 73.515625 72.011719 C 76.386719 69.484375 83.046875 63.625 83.789062 62.96875 C 84.1875 62.609375 84.550781 62.3125 84.578125 62.304688 C 84.617188 62.304688 84.695312 62.375 84.765625 62.453125 Z M 43.847656 73.585938 C 43.914062 73.664062 43.945312 73.78125 43.914062 73.847656 C 43.886719 73.914062 42.625 75.449219 41.113281 77.246094 C 36.542969 82.675781 35.578125 83.835938 33.554688 86.359375 C 32.273438 87.949219 31.554688 88.769531 31.453125 88.75 C 31.320312 88.71875 31.296875 88.183594 31.269531 83.496094 C 31.257812 79.921875 31.28125 78.25 31.347656 78.183594 C 31.414062 78.117188 32.179688 78.078125 33.429688 78.066406 C 35.585938 78.066406 36.398438 77.960938 37.714844 77.53125 C 39.5 76.945312 40.828125 76.09375 42.335938 74.550781 C 42.929688 73.945312 43.476562 73.445312 43.5625 73.445312 C 43.652344 73.4375 43.78125 73.507812 43.847656 73.585938 Z M 74.511719 81.414062 C 80.351562 88.417969 81.476562 89.8125 81.398438 89.941406 C 81.320312 90.070312 34.707031 90.078125 34.628906 89.953125 C 34.550781 89.835938 36.085938 87.9375 41.59375 81.347656 C 44.121094 78.3125 46.257812 75.820312 46.335938 75.800781 C 46.414062 75.78125 47.34375 76.453125 48.398438 77.296875 C 52.273438 80.390625 53.835938 81.367188 55.644531 81.835938 C 57.304688 82.257812 60.097656 82.246094 61.359375 81.828125 C 62.050781 81.59375 62.8125 81.179688 63.5625 80.632812 C 64.109375 80.234375 66.765625 77.96875 68.417969 76.503906 C 69.082031 75.917969 69.421875 75.683594 69.570312 75.703125 C 69.707031 75.722656 71.335938 77.617188 74.511719 81.414062 Z M 74.511719 81.414062 ' />
          <path d='M 48.828125 49.511719 C 48.585938 49.757812 48.574219 50.214844 48.808594 50.421875 C 49.0625 50.65625 49.824219 50.644531 50.03125 50.410156 C 50.4375 49.953125 50.078125 49.316406 49.414062 49.316406 C 49.148438 49.316406 48.953125 49.382812 48.828125 49.511719 Z M 48.828125 49.511719 ' />
          <path d='M 25.195312 67.9375 C 21.835938 69.679688 15.742188 71.867188 13.183594 72.257812 C 12.53125 72.351562 9.121094 72.53125 5.449219 72.648438 C 4.289062 72.675781 3.300781 72.734375 3.273438 72.765625 C 3.210938 72.820312 6.085938 74.707031 7.375 75.460938 C 8.15625 75.90625 10.242188 76.972656 11.335938 77.46875 C 11.75 77.65625 12.109375 77.859375 12.148438 77.921875 C 12.1875 77.976562 11.660156 78.585938 10.859375 79.375 C 10.117188 80.109375 9.21875 81.085938 8.867188 81.542969 C 8.027344 82.648438 5.625 86.21875 5.683594 86.289062 C 5.839844 86.4375 10.421875 85.304688 12.597656 84.5625 C 13.40625 84.289062 14.101562 84.09375 14.132812 84.121094 C 14.160156 84.140625 14.199219 84.902344 14.21875 85.8125 C 14.25 87.453125 14.335938 88.445312 14.609375 90.085938 C 14.8125 91.308594 15.34375 93.679688 15.429688 93.78125 C 15.46875 93.828125 15.789062 93.476562 16.132812 93 C 16.484375 92.519531 17.324219 91.445312 18 90.605469 C 19.394531 88.859375 19.71875 88.40625 20.703125 86.71875 C 21.101562 86.046875 21.484375 85.421875 21.5625 85.320312 C 21.835938 85.007812 22.011719 85.125 22.382812 85.859375 C 22.929688 86.984375 25.617188 90.449219 25.976562 90.507812 C 26.09375 90.527344 26.164062 90.460938 26.203125 90.265625 C 26.230469 90.117188 26.367188 89.472656 26.503906 88.828125 C 26.648438 88.195312 26.828125 87.101562 26.90625 86.386719 C 27.078125 84.804688 27.101562 81.554688 26.933594 80.671875 L 26.804688 80.03125 L 26.789062 80.761719 C 26.71875 82.84375 26.542969 84.53125 26.210938 86.125 C 25.851562 87.890625 25.761719 88.183594 25.554688 88.183594 C 25.429688 88.183594 24.277344 86.632812 23.964844 86.035156 C 23.867188 85.851562 23.476562 84.992188 23.09375 84.132812 C 22.421875 82.597656 22.402344 82.570312 22.050781 82.480469 C 21.503906 82.34375 21.257812 82.507812 20.839844 83.273438 C 20.125 84.589844 19.09375 86.191406 18.222656 87.335938 C 17.734375 87.96875 17.207031 88.664062 17.0625 88.875 C 16.757812 89.289062 16.5625 89.355469 16.414062 89.09375 C 16.289062 88.835938 16.113281 85.945312 16.113281 84.003906 C 16.113281 83.066406 16.074219 82.226562 16.015625 82.128906 C 15.90625 81.921875 15.429688 81.738281 15.007812 81.738281 C 14.679688 81.738281 13.886719 81.960938 12.140625 82.53125 C 10.46875 83.078125 10.382812 82.988281 11.453125 81.757812 C 11.835938 81.308594 12.753906 80.429688 13.476562 79.796875 C 14.902344 78.5625 15.203125 78.164062 15.097656 77.597656 C 15.058594 77.414062 14.921875 77.15625 14.785156 77.023438 C 14.648438 76.882812 13.535156 76.328125 12.273438 75.78125 C 11.023438 75.234375 9.757812 74.667969 9.445312 74.53125 C 9.054688 74.367188 8.886719 74.238281 8.90625 74.132812 C 8.9375 73.964844 8.875 73.976562 11.75 73.742188 C 13.195312 73.613281 13.992188 73.457031 15.476562 72.976562 C 17.429688 72.351562 21.335938 70.59375 23.671875 69.277344 C 26.710938 67.578125 27.859375 66.570312 25.195312 67.9375 Z M 25.195312 67.9375 ' />
        </g>
      </svg>
    </div>
  );
}
