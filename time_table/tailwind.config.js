module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        print: { raw: "print" },
        // => @media print { ... }
      },
      colors: {
        visibility: ["group-hover"],
        bck: {
          1: "#E8F9FD",
          2: "#79DAE8",
          3: "#0AA1DD",
          4: "#2155CD",
          5: "#cbf2ff",
        },
      },
    },
  },
  plugins: [],
};
