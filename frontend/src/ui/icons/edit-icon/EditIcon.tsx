import React from "react";

export default function EditIcon({ color }: { color: string }) {
  return (
    <svg width='38px' height='38px' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' fill='none'>
      <g id='SVGRepo_bgCarrier' strokeWidth='0' />

      <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round' />

      <g id='SVGRepo_iconCarrier'>
        {" "}
        <path
          fill={color}
          fillRule='evenodd'
          d='M15.747 2.97a.864.864 0 011.177 1.265l-7.904 7.37-1.516.194.653-1.785 7.59-7.044zm2.639-1.366a2.864 2.864 0 00-4-.1L6.62 8.71a1 1 0 00-.26.39l-1.3 3.556a1 1 0 001.067 1.335l3.467-.445a1 1 0 00.555-.26l8.139-7.59a2.864 2.864 0 00.098-4.093zM3.1 3.007c0-.001 0-.003.002-.005A.013.013 0 013.106 3H8a1 1 0 100-2H3.108a2.009 2.009 0 00-2 2.19C1.256 4.814 1.5 7.848 1.5 10c0 2.153-.245 5.187-.391 6.81A2.009 2.009 0 003.108 19H17c1.103 0 2-.892 2-1.999V12a1 1 0 10-2 0v5H3.106l-.003-.002a.012.012 0 01-.002-.005v-.004c.146-1.62.399-4.735.399-6.989 0-2.254-.253-5.37-.4-6.99v-.003zM17 17c-.001 0 0 0 0 0zm0 0z'
        />{" "}
      </g>
    </svg>
  );
}
