interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-6 items-center justify-center text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#ffffff] tracking-tight">
          Auth Kit
        </h1>
        <div className="w-12 h-0.5 bg-gradient-to-r from-[#ffffff] to-[#888888] mx-auto rounded-full"></div>
      </div>
      <p className="text-[#888888] text-sm font-medium leading-relaxed max-w-sm">
        {label}
      </p>
    </div>
  );
};
