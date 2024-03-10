export const contacts = [
  {
    id: 1,
    name: "Котик",
    avatar: "https://nztcdn.com/files/5b5ebf93-199c-4420-aea7-fabdade62ede.webp",
    message: "Привет",
    timeStamp: "Вчера",
    unread: 571,
  },
  {
    id: 2,
    name: "Котофей",
    avatar: "https://gas-kvas.com/grafic/uploads/posts/2023-09/1695931387_gas-kvas-com-p-kartinki-s-kotami-21.jpg",
    message: "Пока",
    timeStamp: "12:53",
    unread: 1,
  },
  {
    id: 3,
    name: "Кисюленька",
    avatar: "https://klopik.com/uploads/posts/2020-05/1590685479_i-16.jpg",
    message: "",
    timeStamp: "",
    unread: 0,
  },
  {
    id: 4,
    name: "Котеев Ус Царапыч",
    avatar:
      "https://sneg.top/uploads/posts/2023-06/1687917278_sneg-top-p-avatarki-kotiki-v-kostyumakh-vkontakte-47.jpg",
    message: "Мяумяумяумяумяумяумяумяумяумяумяу",
    timeStamp: "01.03.2024",
    unread: 0,
  },
];

export const messages = [
  { from: "1", message: "Привет", reactions: [] },
  {
    from: "1",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    reactions: [],
  },
  {
    from: "2",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    reactions: [],
  },
  {
    from: "1",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
    reactions: [{ reaction: "❤️", from: "2" }],
  },
  { from: "1", message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit", reactions: [] },
  {
    from: "1",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    reactions: [{ reaction: "🤣", from: "1" }],
  },
  {
    from: "2",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    reactions: [],
  },
  {
    from: "1",
    message:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    reactions: [{ reaction: "❤️", from: "2" }],
  },
  {
    from: "1",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
    reactions: [{ reaction: "❤️", from: "2" }],
  },
  {
    from: "1",
    message:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    reactions: [
      { reaction: "🤣", from: "1" },
      { reaction: "🤣", from: "4" },
      { reaction: "😳", from: "3" },
    ],
  },
  {
    from: "2",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    reactions: [
      { reaction: "🤗", from: "1" },
      { reaction: "🌻", from: "4" },
    ],
  },
  { from: "2", message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit", reactions: [] },
  { from: "2", message: "Мяу", reactions: [] },
];
