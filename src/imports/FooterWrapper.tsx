function ButtonContent() {
  return (
    <div className="relative shrink-0 w-full" data-name="Button content">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[8px] isolate items-center px-[16px] py-[15px] relative w-full">
          <p className="font-['IBM_Plex_Sans:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#0f62fe] text-[14px] tracking-[0.16px] z-[3]">Cancel</p>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-h-px min-w-px overflow-clip relative" data-name="Button">
      <div aria-hidden="true" className="absolute bg-[rgba(255,255,255,0)] inset-0 mix-blend-multiply pointer-events-none" />
      <ButtonContent />
    </div>
  );
}

function CancelSpacer() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Cancel / Spacer">
      <div aria-hidden="true" className="absolute bg-[rgba(255,255,255,0)] inset-0 mix-blend-multiply pointer-events-none" />
      <div className="content-stretch flex items-start pl-[16px] relative size-full">
        <Button />
      </div>
    </div>
  );
}

function ButtonContent1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Button content">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex isolate items-center pl-[16px] pr-[64px] py-[15px] relative w-full">
          <p className="font-['IBM_Plex_Sans:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[14px] text-white tracking-[0.16px] z-[2]">Button</p>
        </div>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#393939] content-stretch flex flex-col h-full items-start overflow-clip relative shrink-0 w-[232px]" data-name="Button">
      <ButtonContent1 />
    </div>
  );
}

function ButtonContent2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Button content">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex isolate items-center pl-[16px] pr-[64px] py-[15px] relative w-full">
          <p className="font-['IBM_Plex_Sans:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[14px] text-white tracking-[0.16px] z-[2]">Button</p>
        </div>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#0f62fe] content-stretch flex flex-col h-full items-start overflow-clip relative shrink-0 w-[232px]" data-name="Button">
      <ButtonContent2 />
    </div>
  );
}

function TearsheetFooterBase() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-px h-[80px] items-start min-h-px min-w-px overflow-clip relative" data-name="_Tearsheet footer base">
      <CancelSpacer />
      <Button1 />
      <Button2 />
    </div>
  );
}

function R2TearsheetFooterItem() {
  return (
    <div className="bg-[#f4f4f4] content-stretch flex items-start relative shrink-0 w-full" data-name="R:2 | Tearsheet footer item">
      <div aria-hidden="true" className="absolute border-[#c6c6c6] border-solid border-t inset-[-1px_0_0_0] pointer-events-none" />
      <TearsheetFooterBase />
    </div>
  );
}

export default function FooterWrapper() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full" data-name="Footer wrapper">
      <R2TearsheetFooterItem />
    </div>
  );
}