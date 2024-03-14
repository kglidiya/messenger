export const users = [
  {
    createdAt: "111", // по сути мне это не нужно
    id: "1",
    username: "",
    email: "cat@mail.ru",
    password: "hash",
    avatar: "https://nztcdn.com/files/5b5ebf93-199c-4420-aea7-fabdade62ede.webp",
    isOnline: false, //пока не реализовано
    userContacts: ["2", "3", "4", "5"],
    isPrinting: false, //пока не реализовано
    //полей ниже в БД быть не должно, они просто для отрисовки, планирую брать из ответа сервера
    message: "Привет",
    timeStamp: "Вчера",
    unread: 571,
  },
  {
    createdAt: "111", // по сути мне это не нужно
    id: "2",
    username: "Котофей",
    email: "catt@mail.ru",
    password: "hash",
    avatar: "https://gas-kvas.com/grafic/uploads/posts/2023-09/1695931387_gas-kvas-com-p-kartinki-s-kotami-21.jpg",
    isOnline: false,
    userContacts: ["1", "3", "4", "5"],
    isPrinting: false, //пока не реализовано
    //полей ниже в БД быть не должно, они просто для отрисовки, планирую брать из ответа сервера
    message: "Пока",
    timeStamp: "12:53",
    unread: 1,
  },
  {
    createdAt: "111", // по сути мне это не нужно
    id: "3",
    username: "Кисюленька",
    email: "cattt@mail.ru",
    password: "hash",
    avatar: "https://proprikol.ru/wp-content/uploads/2020/08/krasivye-kartinki-kotov-37.jpg",
    isOnline: true, //пока не реализовано
    userContacts: [],
    isPrinting: false, //пока не реализовано
    //полей ниже в БД быть не должно, они просто для отрисовки, планирую брать из ответа сервера
    message: "",
    timeStamp: "",
    unread: 0,
  },
  {
    createdAt: "111", // по сути мне это не нужно
    id: "4",
    username: "Котеев Ус Царапыч",
    email: "catttt@mail.ru",
    password: "hash",
    avatar:
      "https://sneg.top/uploads/posts/2023-06/1687917278_sneg-top-p-avatarki-kotiki-v-kostyumakh-vkontakte-47.jpg",
    isOnline: true, //пока не реализовано
    userContacts: [],
    isPrinting: false, //пока не реализовано
    //полей ниже в БД быть не должно, они просто для отрисовки, планирую брать из ответа сервера
    message: "Мяумяумяумяумяумяумяумяумяумяумяу",
    timeStamp: "01.03.2024",
    unread: 0,
  },
  {
    createdAt: "111", // по сути мне это не нужно
    id: "5",
    username: "",
    email: "catttt@mail.ru",
    password: "hash",
    avatar: "",
    isOnline: false, //пока не реализовано
    userContacts: ["1", "3", "4"],
    isPrinting: false, //пока не реализовано
    //полей ниже в БД быть не должно, они просто для отрисовки, планирую брать из ответа сервера
    message: "Пока",
    timeStamp: "12:53",
    unread: 7895,
  },
];

export const messages = [
  {
    createdAt: "12:53",
    id: "1",
    creatorId: "1",
    recipientId: "2",
    message: "Привет",
    reactions: [],
    forwarded: false,
    isRead: true,
    isSent: true,
    isDelivered: true,
    fileId: "", //пустая строка если нет файлов, связывает с таблицей "files" },
  },
  {
    createdAt: "14:50",
    id: "2",
    creatorId: "1",
    recipientId: "2",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    reactions: [],
    forwarded: false,
    isRead: true,
    isSent: true,
    isDelivered: true,
    fileId: "", //пустая строка если нет файлов, связывает с таблицей "files"
  },
  {
    createdAt: "00:53",
    id: "3",
    creatorId: "2",
    recipientId: "1",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    reactions: [],
    forwarded: false,
    isRead: true,
    isSent: true,
    isDelivered: true,
    fileId: "", //пустая строка если нет файлов, связывает с таблицей "files"
  },
  {
    createdAt: "12:08",
    id: "4",
    creatorId: "1",
    recipientId: "2",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
    reactions: [{ reaction: "❤️", creatorId: "2" }],
    forwarded: false,
    isRead: true,
    isSent: true,
    isDelivered: true,
    fileId: "", //пустая строка если нет файлов, связывает с таблицей "files"
  },
  {
    createdAt: "17:53",
    id: "5",
    creatorId: "1",
    recipientId: "2",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    reactions: [],
    forwarded: false,
    isRead: true,
    isSent: true,
    isDelivered: true,
    fileId: "", //пустая строка если нет файлов, связывает с таблицей "files"
  },
  {
    createdAt: "12:03",
    id: "6",
    creatorId: "1",
    recipientId: "2",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    reactions: [{ reaction: "🤣", creatorId: "1" }],
    forwarded: false,
    isRead: true,
    isSent: true,
    isDelivered: true,
    fileId: "", //пустая строка если нет файлов, связывает с таблицей "files"
  },
  {
    createdAt: "18:03",
    id: "7",
    creatorId: "2",
    recipientId: "1",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    reactions: [],
    forwarded: true,
    isRead: true,
    isSent: true,
    isDelivered: true,
    fileId: "", //пустая строка если нет файлов, связывает с таблицей "files"
  },
  {
    createdAt: "12:00",
    id: "8",
    creatorId: "1",
    recipientId: "2",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    reactions: [{ reaction: "❤️", creatorId: "2" }],
    forwarded: false,
    isRead: true,
    isSent: true,
    isDelivered: true,
    fileId: "", //пустая строка если нет файлов, связывает с таблицей "files"
  },
  {
    createdAt: "19:53",
    id: "9",
    creatorId: "1",
    recipientId: "2",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
    reactions: [
      { reaction: "❤️", creatorId: "2" },
      { reaction: "🌻", creatorId: "3" },
      { reaction: "❤️", creatorId: "4" },
      { reaction: "❤️", creatorId: "1" },
      { reaction: "🤣", creatorId: "1" },
      { reaction: "🤣", creatorId: "4" },
      { reaction: "😳", creatorId: "5" },
    ],
    forwarded: false,
    isRead: true,
    isSent: true,
    isDelivered: true,
    fileId: "", //пустая строка если нет файлов, связывает с таблицей "files"
  },
  {
    createdAt: "01:53",
    id: "10",
    creatorId: "1",
    recipientId: "2",
    message:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    reactions: [
      { reaction: "🤣", creatorId: "1" },
      { reaction: "🤣", creatorId: "4" },
      { reaction: "😳", creatorId: "3" },
    ],
    forwarded: false,
    isRead: true,
    isSent: true,
    isDelivered: true,
    fileId: "", //пустая строка если нет файлов, связывает с таблицей "files"
  },
  {
    createdAt: "12:53",
    id: "11",
    creatorId: "2",
    recipientId: "1",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    reactions: [
      { reaction: "🤗", creatorId: "1" },
      { reaction: "🌻", creatorId: "4" },
      { reaction: "❤️", creatorId: "3" },
    ],
    forwarded: true,
    isRead: true,
    isSent: true,
    isDelivered: true,
    fileId: "1",
  },
  {
    createdAt: "19:54",
    id: "12",
    creatorId: "1",
    recipientId: "2",
    message: "",
    reactions: [],
    forwarded: false,
    isRead: true,
    isSent: true,
    isDelivered: true,
    fileId: "2",
  },
  {
    createdAt: "13:53",
    id: "13",
    creatorId: "2",
    recipientId: "1",
    message: "Мяу",
    reactions: [],
    forwarded: false,
    isRead: true,
    isSent: true,
    isDelivered: true,
    fileId: "", //пустая строка если нет файлов, связывает с таблицей "files"
  },
  {
    createdAt: "12:07",
    id: "14",
    creatorId: "1",
    recipientId: "3",
    message: "Ca va?",
    reactions: [],
    forwarded: false,
    isRead: true,
    isSent: true,
    isDelivered: true,
    fileId: "", //пустая строка если нет файлов, связывает с таблицей "files"
  },
  {
    createdAt: "12:53",
    id: "15",
    creatorId: "5",
    recipientId: "1",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    reactions: [],
    forwarded: false,
    isRead: true,
    isSent: true,
    isDelivered: true,
    fileId: "", //пустая строка если нет файлов, связывает с таблицей "files"
  },
];

export const files = [
  {
    id: "1", // уникальный идентификатор медиафайла;
    messageId: "11", // идентификатор сообщения, к которому относится медиафайл;
    type: "image", // тип медиафайла (фотография, видео, аудио и др.);
    file_path: "...?", //путь к файлу на сервере;
    thumbnailPath:
      "https://sneg.top/uploads/posts/2023-04/1681632422_sneg-top-p-kot-s-tsvetami-kartinki-krasivo-17.jpg", //путь к миниатюре медиафайла (для фотографий и видео);
    createdAt: "7777", //дата и время создания медиафайла.
  },
  {
    id: "2",
    messageId: "12",
    type: "image",
    file_path: "...?",
    thumbnailPath: "https://w.forfun.com/fetch/71/71cf5a68d51acab5f06c69c96b81c8a4.jpeg",
    createdAt: "7777",
  },
];
