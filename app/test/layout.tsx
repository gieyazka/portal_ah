export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    console.log('test');
    
  return (
    <div>
      this is Test Layout
      {children}
    </div>
  );
}
