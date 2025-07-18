import TypingText from "@/components/TypingText";
export default function Page() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-7 grid-rows-7 gap-4 p-4 ">
      <div className="bg-muted/50 rounded-xl order-1 min-h-[100px] md:col-span-3 md:row-span-2 md:col-start-1 md:row-start-1">
        <div className="flex items-center justify-between mx-4 md:mx-10 h-full px-4">
          <div className="flex flex-col items-center mr-6">
            <TypingText text="YEAR" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="mb-2">
              <img
                src="/Battery.gif"
                className="w-[40px] h-[40px]"
                alt="Battery GIF"
              />
            </div>
            <div>
              <img
                src="/Water.gif"
                className="w-[40px] h-[40px]"
                alt="Water GIF"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl order-2 min-h-[100px] md:col-span-3 md:row-span-2 md:col-start-1 md:row-start-3">
        <div className="flex items-center justify-between mx-4 md:mx-10 h-full px-4">
          <div className="flex flex-col items-center mr-6">
            <TypingText text="MONTH" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="mb-2">
              <img
                src="/Battery.gif"
                className="w-[40px] h-[40px]"
                alt="Battery GIF"
              />
            </div>
            <div>
              <img
                src="/Water.gif"
                className="w-[40px] h-[40px]"
                alt="Water GIF"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl order-3 min-h-[100px] md:col-span-3 md:row-span-2 md:col-start-1 md:row-start-5">
        <div className="flex items-center justify-between mx-4 md:mx-10 h-full px-4">
          <div className="flex flex-col items-center mr-6">
            <TypingText text="YESTERDAY" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="mb-2">
              <img
                src="/Battery.gif"
                className="w-[40px] h-[40px]"
                alt="Battery GIF"
              />
            </div>
            <div>
              <img
                src="/Water.gif"
                className="w-[40px] h-[40px]"
                alt="Water GIF"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Column 4 */}
      <div className="bg-muted/50 rounded-xl order-4 min-h-[100px] md:col-span-2 md:col-start-4 md:row-start-1">
        <div className="flex items-center justify-between mx-[10vh] h-full px-4">
          <div className="flex items-center mr-6">
            <img
              src="/Battery.gif"
              className="w-[40px] h-[40px]"
              alt="Battery GIF"
            />
            <div>บ่อบำบัด :</div>
          </div>
        </div>
      </div>
      <div className="bg-muted/50 rounded-xl order-5 min-h-[100px] md:col-span-2 md:col-start-4 md:row-start-2">
        <div className="flex items-center justify-between mx-[10vh] h-full px-4">
          <div className="flex items-center mr-6">
            <img
              src="/Battery.gif"
              className="w-[40px] h-[40px]"
              alt="Battery GIF"
            />
            <div>บ่อสูบน้ำเสีย อาคาร 1 :</div>
          </div>
        </div>
      </div>
      <div className="bg-muted/50 rounded-xl order-6 min-h-[100px] md:col-span-2 md:col-start-4 md:row-start-3">
        <div className="flex items-center justify-between mx-[10vh] h-full px-4">
          <div className="flex items-center mr-6">
            <img
              src="/Battery.gif"
              className="w-[40px] h-[40px]"
              alt="Battery GIF"
            />
            <div>บ่อสูบน้ำเสีย อาคาร 2 :</div>
          </div>
        </div>
      </div>
      <div className="bg-muted/50 rounded-xl order-7 min-h-[100px] md:col-span-2 md:col-start-4 md:row-start-4">
        <div className="flex items-center justify-between mx-[10vh] h-full px-4">
          <div className="flex items-center mr-6">
            <img
              src="/Battery.gif"
              className="w-[40px] h-[40px]"
              alt="Battery GIF"
            />
            <div>รวม :</div>
          </div>
        </div>
      </div>
      <div className="bg-muted/50 rounded-xl order-8 min-h-[100px] md:col-span-2 md:col-start-4 md:row-start-5">
        <div className="flex items-center justify-between mx-[10vh] h-full px-4">
          <div className="flex items-center mr-6">
            <img
              src="/Battery.gif"
              className="w-[40px] h-[40px]"
              alt="Battery GIF"
            />
            <div>น้ำเข้า :</div>
          </div>
        </div>
      </div>
      <div className="bg-muted/50 rounded-xl order-9 min-h-[100px] md:col-span-2 md:col-start-4 md:row-start-6">
        <div className="flex items-center justify-between mx-[10vh] h-full px-4">
          <div className="flex items-center mr-6">
            <img
              src="/Battery.gif"
              className="w-[40px] h-[40px]"
              alt="Battery GIF"
            />
            <div>น้ำออก :</div>
          </div>
        </div>
      </div>

      {/* Column 6 */}
      <div className="bg-muted/50 rounded-xl order-10 min-h-[100px] md:col-span-2 md:col-start-6 md:row-start-1">
        <div className="flex items-center justify-between mx-[10vh] h-full px-4">
          <div className="flex items-center mr-6">
            <img
              src="/Battery.gif"
              className="w-[40px] h-[40px]"
              alt="Battery GIF"
            />
            <div>น้ำแอร์รังผึ้งอาคาร 2 :</div>
          </div>
        </div>
      </div>
      <div className="bg-muted/50 rounded-xl order-11 min-h-[100px] md:col-span-2 md:col-start-6 md:row-start-2">
        <div className="flex items-center justify-between mx-[10vh] h-full px-4">
          <div className="flex items-center mr-6">
            <img
              src="/Battery.gif"
              className="w-[40px] h-[40px]"
              alt="Battery GIF"
            />
            <div>น้ำใช้อาคาร 2 :</div>
          </div>
        </div>
      </div>
      <div className="bg-muted/50 rounded-xl order-12 min-h-[100px] md:col-span-2 md:col-start-6 md:row-start-3">
        <div className="flex items-center justify-between mx-[10vh] h-full px-4">
          <div className="flex items-center mr-6">
            <img
              src="/Battery.gif"
              className="w-[40px] h-[40px]"
              alt="Battery GIF"
            />
            <div>น้ำบำบัดกลับมาใช้ใหม่ :</div>
          </div>
        </div>
      </div>
      <div className="bg-muted/50 rounded-xl order-13 min-h-[100px] md:col-span-2 md:col-start-6 md:row-start-4">
        <div className="flex items-center justify-between mx-[10vh] h-full px-4">
          <div className="flex items-center mr-6">
            <img
              src="/Battery.gif"
              className="w-[40px] h-[40px]"
              alt="Battery GIF"
            />
            <div>น้ำดื่ม :</div>
          </div>
        </div>
      </div>
      <div className="bg-muted/50 rounded-xl order-14 min-h-[100px] md:col-span-2 md:col-start-6 md:row-start-5">
        <div className="flex items-center justify-between mx-[10vh] h-full px-4">
          <div className="flex items-center mr-6">
            <img
              src="/Battery.gif"
              className="w-[40px] h-[40px]"
              alt="Battery GIF"
            />
            <div>น้ำแอร์รังผึ้งอาคาร 1 :</div>
          </div>
        </div>
      </div>
      <div className="bg-muted/50 rounded-xl order-15 min-h-[100px] md:col-span-2 md:col-start-6 md:row-start-6">
        <div className="flex items-center justify-between mx-[10vh] h-full px-4">
          <div className="flex items-center mr-6">
            <img
              src="/Battery.gif"
              className="w-[40px] h-[40px]"
              alt="Battery GIF"
            />
            <div>น้ำใช้อาคาร 1 :</div>
          </div>
        </div>
      </div>

      {/* Footer full width */}
      <div className="bg-muted/50 rounded-xl order-16 min-h-[100px] md:col-span-7 md:row-start-7 overflow-hidden flex items-center">
        <div className="flex flex-col justify-center bg-gray-500 w-full h-[10vh]">
          <div className="animate-marquee2 whitespace-nowrap inline-block w-full">
            <span className="text-6xl mx-4 text-green-500 font-bold">
              NORMAL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
