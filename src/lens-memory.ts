import { launch, Locator, Page } from 'puppeteer';
import { LENS_MEMORY_SETTINGS } from './projector.js';

const USERNAME = 'EPSONWEB';
const PASSWORD = 'p5au5agep';
const IP_ADDRESS = '192.168.1.64';

async function SleepMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class EpsonLensMemorySetter {
  private currentSlot = 0;

  constructor(private headless = false) {
    console.log(`EpsonLensMemorySetter: Initialized with headless=${this.headless}`);
  }

  private async performLensMemorySetActions(page: Page, memorySlot: number, timeout=5000): Promise<void> {
    console.log(`EpsonLensMemorySetter: Setting lens memory to slot ${memorySlot}`);

    console.log(`step 1`);
    {
        const targetPage = page;
        await targetPage.setViewport({
            width: 695,
            height: 981
        })
    }

    console.log(`step 2`);
    {
        const targetPage = page;
        await targetPage.goto(`http://${USERNAME}:${PASSWORD}@${IP_ADDRESS}/cgi-bin/home`);
    }

    console.log(`step 3`);
    {
        const targetPage = page;
        await Locator.race([
            targetPage.locator('::-p-aria(Advanced) >>>> ::-p-aria([role=\\"paragraph\\"])'),
            targetPage.locator('#fixed-position > div > div:nth-of-type(1) p'),
            targetPage.locator('::-p-xpath(//*[@id=\\"fixed-position\\"]/div/div[1]/button/p)'),
            targetPage.locator(':scope >>> #fixed-position > div > div:nth-of-type(1) p')
        ])
        .setTimeout(timeout)
        .click({
          offset: {
            x: 60.046875,
            y: 12.1953125,
          },
        });
    }

    console.log(`step 4`);
    {
        const targetPage = page;
        await Locator.race([
            targetPage.locator('app-page-header-advanced > div > div > div > div > div:nth-of-type(1) > div > div'),
            targetPage.locator('::-p-xpath(/html/body/app-root/div/app-videoadjust-config/app-page-header-advanced/div/div/div/div/div[1]/div/div)'),
            targetPage.locator(':scope >>> app-page-header-advanced > div > div > div > div > div:nth-of-type(1) > div > div')
        ])
        .setTimeout(timeout)
        .click({
          offset: {
            x: 22,
            y: 24.75,
          },
        });
    }

    console.log(`step 5`);
    {
        const targetPage = page;
        await Locator.race([
            targetPage.locator('li:nth-of-type(10) > div'),
            targetPage.locator('::-p-xpath(/html/body/app-root/div/app-videoadjust-config/app-drawer-menu/div/ul/li[10]/div)'),
            targetPage.locator(':scope >>> li:nth-of-type(10) > div'),
            targetPage.locator('::-p-text(Memory)')
        ])
        .setTimeout(timeout)
        .click({
          offset: {
            x: 54,
            y: 25.5,
          },
        });
    }

    console.log(`step 6`);
    {
        const targetPage = page;
        await Locator.race([
            targetPage.locator('::-p-aria(MENU_LENSPOSITION) >>>> ::-p-aria([role=\\"paragraph\\"])'),
            targetPage.locator('#LENSPOSITION-MEMORY_SAVE-BUTTON p'),
            targetPage.locator('::-p-xpath(//*[@id=\\"LENSPOSITION-MEMORY_SAVE-BUTTON\\"]/div/div/div[1]/p)'),
            targetPage.locator(':scope >>> #LENSPOSITION-MEMORY_SAVE-BUTTON p'),
            targetPage.locator('::-p-text(Lens Position)')
        ])
        .setTimeout(timeout)
        .click({
          offset: {
            x: 90,
            y: 25,
          },
        });
    }

    console.log(`step 7`);
    {
        const targetPage = page;
        await Locator.race([
            targetPage.locator('::-p-aria(MENU_MEMORYCALL) >>>> ::-p-aria([role=\\"combobox\\"])'),
            targetPage.locator('div.ng-trigger-MemoryLensPosition app-memory-config-selectbox:nth-of-type(2) select'),
            targetPage.locator('::-p-xpath(/html/body/app-root/div/app-memory-config/div/div/div[3]/app-memory-config-detail/div/div/app-memory-config-selectbox[2]/div/form/div[2]/div/div[1]/select)'),
            targetPage.locator(':scope >>> div.ng-trigger-MemoryLensPosition app-memory-config-selectbox:nth-of-type(2) select')
        ])
        .setTimeout(timeout)
        .fill(`0${memorySlot}`);
    }

    console.log(`step 8`);
    {
        const targetPage = page;
        await Locator.race([
            targetPage.locator('::-p-aria(MENU_MEMORYCALL) >>>> ::-p-aria(Set)'),
            targetPage.locator('div.ng-trigger-MemoryLensPosition app-memory-config-selectbox:nth-of-type(2) input'),
            targetPage.locator('::-p-xpath(/html/body/app-root/div/app-memory-config/div/div/div[3]/app-memory-config-detail/div/div/app-memory-config-selectbox[2]/div/form/div[2]/div/div[2]/input)'),
            targetPage.locator(':scope >>> div.ng-trigger-MemoryLensPosition app-memory-config-selectbox:nth-of-type(2) input')
        ])
        .setTimeout(timeout)
        .click({
          offset: {
            x: 22.9453125,
            y: 11.3125,
          },
        });
    }

    console.log(`step 9 - wait 5s`);
    await SleepMs(5000);

    console.log(`EpsonLensMemorySetter: Successfully set lens memory to slot ${memorySlot}`);
  }

  async setLensMemory(memorySlot: number): Promise<void> {
    if (memorySlot < 1) {
      throw new Error(`EpsonLensMemorySetter: Invalid memory slot: memorySlot=${memorySlot}`);
    }

    if (memorySlot > LENS_MEMORY_SETTINGS.length) {
      throw new Error(`EpsonLensMemorySetter: Memory slot memorySlot=${memorySlot} is not configured in LENS_MEMORY_SETTINGS.`);
    }

    if (this.currentSlot === memorySlot) {
      console.log(`EpsonLensMemorySetter: Memory slot ${memorySlot} is already set. No action needed.`);
      return;
    }

    const browser = await launch({
      headless: this.headless,
    });

    const page = await browser.newPage();
    const timeout = 5000;
    page.setDefaultTimeout(timeout);

    try {
      await this.performLensMemorySetActions(page, memorySlot);
      this.currentSlot = memorySlot;
    }
    catch (error) {
      console.error(`EpsonLensMemorySetter: Error setting lens memory to slot ${memorySlot}:`, error);
    }

    console.log(`EpsonLensMemorySetter: Closing browser`);
    await browser.close();
  }


}