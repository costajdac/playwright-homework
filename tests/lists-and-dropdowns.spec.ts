import { test, expect } from '@playwright/test'

test.beforeEach( async({page}) => {
    await page.goto('/')
})

test.describe('Lists and Dropdowns', () => {
    test.beforeEach(async({page}) => {
        // 1. Select the OWNERS menu item in the navigation bar and then select "Search" from the drop-down menu
        await page.getByRole('button', {name:'Owners'}).click()
        await page.getByRole('link', {name:'Search'}).click()
    })

    test('Validate selected pet types from list', async({page}) => {
        // 2. Add assertion of the "Owners" text displayed 
        await expect(page.getByRole('heading')).toHaveText('Owners')

        // 3. Select the first owner, "George Franklin"
        await page.getByRole('link', {name:'George Franklin'}).click()

        // 4. Add the assertion for the owner "Name", the value "George Franklin" is displayed
        await expect(page.locator('.ownerFullName')).toHaveText('George Franklin')

        // 5. In the "Pets and Visits" section, click on "Edit Pet" button for the pet with the name "Leo"
        await page.getByRole('button', {name:'Edit Pet'}).click()

        // 6. Add assertion of "Pet" text displayed as a header on the page
        await expect(page.getByRole('heading')).toHaveText('Pet')

        // 7. Add the assertion "George Franklin" name is displayed in the "Owner" field
        await expect(page.locator('input[name="owner_name"]')).toHaveValue('George Franklin')

        // 8. Add the assertion that the value "cat" is displayed in the "Type" field 
        await expect(page.locator('#type1')).toHaveValue('cat')

        // 9. Using a loop, select the values from the drop-down one by one, and add the assertion that every selected value from the drop-down is displayed in the "Type" field
        const petTypeList = page.locator('#type option').allTextContents()

        
        for(const petItem in petTypeList){
            await petItem.selectOption({petItem})
        }
        // Hint: To select the options from the dropdown, use the Playwright method selectOption()
    })
})