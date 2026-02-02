import Image from "next/image";

export function TeamSwitcher() {
  return (
    <div className="flex items-center gap-1">
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
        <Image src="/logo1.png" width={25} height={25} alt="logo" />
      </div>
      <span className="truncate font-medium"> Talentz </span>
    </div>
  );
}
