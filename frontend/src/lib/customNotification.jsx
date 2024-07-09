import { toast } from "@/components/ui/use-toast";
import { getCurrentDateTime } from "./toast";

export const customNotification = (title, desc) => (
    toast({
        title: title,
        description: (
            <div className="">
                <div className="flex flex-col py-1">
                    <div>
                        {desc && desc}
                    </div>
                    <p className="text-[0.65rem] tracking-tighter text-gray-500">

                        {getCurrentDateTime()}
                    </p>
                </div>
            </div>
        ),
    })
)