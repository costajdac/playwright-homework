import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
  await page.goto('/')
})


test.describe('Pet Types', () => {
    test.beforeEach(async({page}) => {
        // 1. Select the PET TYPES menu item in the navigation bar
        await page.getByText('Pet Types').click()
        // 2. Add assertion of the "Pet Types" text displayed above the table
        await expect(page.getByRole('heading')).toHaveText('Pet Types')
       
    })
    
    test('Update pet type', async({page}) => {
        // 3. Click on "Edit" button for the "cat" pet type
        await page.getByRole('row', {name:'cat'}).getByRole('button', { name: 'Edit' }).click()

        // 4. Add assertion of the "Edit Pet Type" text displayed
        await expect(page.getByRole('heading')).toHaveText('Edit Pet Type')
        
        // 5. Change the pet type name from "cat" to "rabbit" and click "Update" button
        const petTypeInputField = page.getByRole('textbox')
        await expect(petTypeInputField).toHaveValue('cat')
        await petTypeInputField.fill('rabbit')
        await page.getByRole('button', {name:'Update'}).click()
        
        // 6. Add the assertion that the first pet type in the list of types has a value "rabbit" 
        const firstPetTypeInputField = page.locator('[id="0"]')
        await expect(firstPetTypeInputField).toHaveValue('rabbit')

        // 7. Click on "Edit" button for the same "rabbit" pet type
        await page.getByRole('row', {name:'rabbit'}).getByRole('button', {name:'Edit'}).click()

        // 8. Change the pet type name back from "rabbit" to "cat" and click "Update" button
        await expect(petTypeInputField).toHaveValue('rabbit')
        await petTypeInputField.fill('cat')
        await page.getByRole('button', {name:'Update'}).click()

        // 9. Add the assertion that the first pet type in the list of names has a value "cat" 
        await expect(firstPetTypeInputField).toHaveValue('cat')
    })

    test('Cancel Pet Type Update', async ({page}) => {
        // 3. Click on "Edit" button for the "dog" pet type
        await page.getByRole('row', {name:'dog'}).getByRole('button', {name: 'Edit'}).click()

        // 4. Type the new pet type name "moose"
        const petTypeInputField = page.getByRole('textbox')
        await expect(petTypeInputField).toHaveValue('dog')
        await petTypeInputField.fill('moose')

        // 5. Add assertion the value "moose" is displayed in the input field of the "Edit Pet Type" page
        await expect(petTypeInputField).toHaveValue('moose')

        // 6. Click on "Cancel" button
        await page.getByRole('button', {name:'Cancel'}).click()

        // 7. Add the assertion the value "dog" is still displayed in the list of pet types
        const secondPetTypeInputField = page.locator('[id="1"]')
        await expect(secondPetTypeInputField).toHaveValue('dog')
    })

    test('Validation of Pet type name is required', async({page}) => {
        // 3. Click on "Edit" button for the "lizard" pet type
        await page.getByRole('row', {name:'lizard'}).getByRole('button', {name:'Edit'}).click()

        // 4. On the Edit Pet Type page, clear the input field
        const petTypeInputField = page.getByRole('textbox')
        await expect(petTypeInputField).toHaveValue('lizard')
        await petTypeInputField.clear()
        
        // 5. Add the assertion for the "Name is required" message below the input field
        await expect(page.locator('.help-block')).toHaveText('Name is required')

        // 6. Click on "Update" button
        await page.getByRole('button', {name:'Update'}).click()

        // 7. Add assertion that "Edit Pet Type" page is still displayed
        await expect(page.getByRole('heading')).toHaveText('Edit Pet Type')

        // 8. Click on the "Cancel" button
        await page.getByRole('button', {name:'Cancel'}).click()

        // 9. Add assertion that "Pet Types" page is displayed
        await expect(page.getByRole('heading')).toHaveText('Pet Types')
    })

})
