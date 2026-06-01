import classNames from '@/common/utils/classNames';

import { ComponentType, SVGAttributes } from 'react';



export interface ChatAssistantSuggestedTool {

  id: string;

  title: string;

  description: string;

  icon?: ComponentType<SVGAttributes<SVGElement>>;

  buttonVariant?: 'primary' | 'secondary';

}



export const CHAT_ASSISTANT_SUGGESTED_TOOLS: ChatAssistantSuggestedTool[] = [

  {

    id: 'prescribe',

    title: 'تجویز نسخه',

    description: 'بر اساس گفت‌وگو و شرح حال بیمار، نسخه پیشنهادی آماده و ارسال می‌شود.',

    buttonVariant: 'primary',

  },

  {

    id: 'insurance',

    title: 'فاکتور بیمه',

    description: 'صدور فاکتور بیمه تکمیلی مرتبط با این گفت‌وگو.',

    buttonVariant: 'secondary',

  },

];



interface ChatAssistantSuggestedToolsProps {

  tools?: ChatAssistantSuggestedTool[];

  disabled?: boolean;

  visible?: boolean;

  onRun?: (tool: ChatAssistantSuggestedTool) => void;

}



export const ChatAssistantSuggestedTools = ({

  tools = CHAT_ASSISTANT_SUGGESTED_TOOLS,

  disabled = true,

  visible = true,

  onRun,

}: ChatAssistantSuggestedToolsProps) => (

  <div

    className={classNames('transition-all duration-300', {

      'translate-y-2 opacity-0': !visible,

      'translate-y-0 opacity-100': visible,

    })}

  >

    <p className="mb-5 text-right text-xs font-medium text-slate-400">ابزارهای پیشنهادی</p>



    <div className="space-y-6">

      {tools.map(tool => (

        <div key={tool.id} className="text-right">

          <p className="text-[15px] font-bold text-slate-900">{tool.title}</p>

          <p className="mt-1.5 text-xs leading-6 text-slate-500">{tool.description}</p>



          <button

            type="button"

            disabled={disabled}

            onClick={() => onRun?.(tool)}

            className={classNames(

              'mt-3 w-full rounded-xl bg-[#1a1c1e] py-3 text-sm font-semibold text-white transition active:scale-[0.99]',

              disabled ? 'cursor-default opacity-80' : 'hover:bg-black',

            )}

          >

            اجرا

          </button>

        </div>

      ))}

    </div>

  </div>

);



export default ChatAssistantSuggestedTools;

