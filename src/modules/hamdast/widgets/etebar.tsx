import Divider from "@/common/components/atom/divider";

export const Etebar__ArgProps = new Array<any>(
  "profileData",
  "data"
);

export default function Etebar({ data }: any) {
  console.log(data)
  return (
    <div className="flex flex-col gap-3">
      <div className="px-4 md:px-0">

        <h2 className="font-bold">
          امتیاز در سایر پلتفرم‌ها
        </h2>
      </div>
      <div className="bg-white flex justify-around gap-3 rounded-none items-center  md:rounded-lg p-3">
        {
          data.map((item: any, index: number) => (
            <>
              <div key={item.name} className="flex flex-col gap-1 items-center justify-center">
                <img className="w-20 h-8 object-contain" src={item?.logo} alt="" />
                <span className="font-semibold text-sm bg-blue-500/10 flex justify-center items-center h-5 px-4  text-primary rounded-full">{item?.rate}</span>
              </div>
              {index < data?.length - 1 && <Divider orientation="vertical" className="!h-9 !w-[2px]" />}
            </>
          ))
        }
      </div>
    </div>
  )
}
