import "./globals.css";

export const metadata = {
  title: "DYFI Dakshina Kannada — Admin Control Panel",
  description: "Democratic Youth Federation of India (DYFI) Dakshina Kannada District Committee Admin Dashboard.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/images/logo.png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
