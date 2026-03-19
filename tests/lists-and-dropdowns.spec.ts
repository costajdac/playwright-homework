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
        const leoPetSection =  page.locator('app-pet-list', { hasText: 'Leo'})
        const editPetButton = leoPetSection.getByRole('button', {name:'Edit Pet'})
        await editPetButton.click()

        // 6. Add assertion of "Pet" text displayed as a header on the page
        await expect(page.getByRole('heading')).toHaveText('Pet')

        // 7. Add the assertion "George Franklin" name is displayed in the "Owner" field
        await expect(page.locator('input[name="owner_name"]')).toHaveValue('George Franklin')

        // 8. Add the assertion that the value "cat" is displayed in the "Type" field 
        const petTypeInputField = page.locator('#type1')
        await expect(petTypeInputField).toHaveValue('cat')

        // 9. Using a loop, select the values from the drop-down one by one, and add the assertion that every selected value from the drop-down is displayed in the "Type" field
        const selectedPetDropDownField = page.locator('#type')
        const allPetTypeDropDownList = await selectedPetDropDownField.locator('option').allTextContents()

        for(const petDropDownItem of allPetTypeDropDownList){
            await selectedPetDropDownField.selectOption(petDropDownItem )
            await expect(petTypeInputField).toHaveValue(petDropDownItem)
        }
        // Hint: To select the options from the dropdown, use the Playwright method selectOption()
    })

    test('Validate Pet Update', async({page}) => {
        // 3. Select the owner "Eduardo Rodriquez"
        await page.getByRole('link', {name:'Eduardo Rodriquez'}).click()

        // 4. In the "Pets and Visits" section, click on "Edit Pet" button for the pet with the name "Rosy"
        const petAndVisitsSection =  page.locator('app-pet-list', { hasText: 'Rosy'})
        const editPetButton = petAndVisitsSection.getByRole('button', {name:'Edit Pet'})
        await editPetButton.click()

        // 5. Add the assertion that the name "Rosy" is displayed in the input field "Name"
        const petNameInputField = page.getByRole('textbox', {name:'name'})
        await expect(petNameInputField).toHaveValue('Rosy')

        // 6. Add the assertion the value "dog" is displayed in the "Type" field 
        const petTypeInputField = page.locator('#type1')
        await expect(petTypeInputField).toHaveValue('dog')

        // 7. From the drop-down menu, select the value "bird"
        const selectedPetDropDownField = page.getByLabel('Type')
        await selectedPetDropDownField.selectOption('bird')

        // 8. On the "Pet details" page, add the assertion the value "bird" is displayed in the "Type" field as well as drop-down input field
        await expect(selectedPetDropDownField).toHaveValue('bird')
        await expect(petTypeInputField).toHaveValue('bird')

        // 9. Select the "Update Pet" button
        await page.getByRole('button', {name:'Update Pet'}).click()

        // 10. On the "Owner Information" page, add the assertion that the pet "Rosy" has a new value of the Type "bird"
        await expect(petAndVisitsSection.locator('dd').nth(2)).toHaveText('bird')

        // 11. Select the "Edit Pet" button one more time, and perform steps 6-10 to revert the selection of the pet type "bird" to its initial value "dog"
        await editPetButton.click()
        await expect(petTypeInputField).toHaveValue('bird')
        await selectedPetDropDownField.selectOption('dog')
        await expect(selectedPetDropDownField).toHaveValue('dog')
        await expect(petTypeInputField).toHaveValue('dog')
        await page.getByRole('button', {name:'Update Pet'}).click()
        await expect(petAndVisitsSection.locator('dd').nth(2)).toHaveText('dog')

    })
})