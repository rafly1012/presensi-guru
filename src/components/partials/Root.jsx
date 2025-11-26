const Root = ({ children }) => {
  return (
    <div className="relative isolate flex min-h-screen flex-col bg-background">
      {children}
    </div>
  );
};

export { Root };
