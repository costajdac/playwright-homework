import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
  await page.goto('/')
})


test.describe('Pet Types', () => {
    test.beforeEach(async({page}) => {
        // 1. Select the PET TYPES menu item in the navigation bar
        await page.getByText('Pet Types').click()
        // 2. Add assertion of the "Pet Types" text displayed above the table
        await expect(page.getByRole('heading', {name: 'Pet Types'})).toHaveText('Pet Types')
       
    })
    
    test('Update pet type', async({page}) => {
        // 3. Click on "Edit" button for the "cat" pet type
        const editButton = page.locator('tr', { has: page.locator('[id="0"]') })
            .getByRole('button', { name: 'Edit' })
        await editButton.click()

        // 4. Add assertion of the "Edit Pet Type" text displayed
        await expect(page.getByRole('heading', {name: 'Edit Pet Type'})).toHaveText('Edit Pet Type')
        
        // 5. Change the pet type name from "cat" to "rabbit" and click "Update" button
        const updateName = page.locator('input[name="name"]')
        await expect(updateName).not.toHaveValue('')
        await updateName.fill('rabbit')
        const updateButton = page.getByRole('button', {name:'Update'})
        await updateButton.click()
        
        // 6. Add the assertion that the first pet type in the list of types has a value "rabbit" 
        const firstRow = (page.locator('[id="0"]'))
        await expect(firstRow).toHaveValue('rabbit')

        // 7. Click on "Edit" button for the same "rabbit" pet type
        await editButton.click()

        // 8. Change the pet type name back from "rabbit" to "cat" and click "Update" button
        await expect(updateName).not.toHaveValue('')
        await updateName.fill('cat')
        await updateButton.click()

        // 9. Add the assertion that the first pet type in the list of names has a value "cat" 
        await expect(firstRow).toHaveValue('cat')
    })

    test('Cancel Pet Type Update', async ({page}) => {
        // 3. Click on "Edit" button for the "dog" pet type
        const dogRow = page.locator('tr', { has: page.locator('[id="1"]') })
        await dogRow.getByRole('button', { name: 'Edit' }).click()

        // 4. Type the new pet type name "moose"
        const updateName = page.locator('input[name="name"]')
        await expect(updateName).not.toHaveValue('')
        await updateName.fill('moose')

        // 5. Add assertion the value "moose" is displayed in the input field of the "Edit Pet Type" page
        await expect(updateName).toHaveValue('moose')

        // 6. Click on "Cancel" button
        const buttonCancel = page.getByRole('button', {name:'Cancel'})
        await buttonCancel.click()

        // 7. Add the assertion the value "dog" is still displayed in the list of pet types
        const dogItem = page.locator('[id="1"]')
        await expect(dogItem).toHaveValue('dog')
    })

    test('Validation of Pet type name is required', async({page}) => {
        // 3. Click on "Edit" button for the "lizard" pet type
        const lizzardRow = page.locator('tr', {has: page.locator('[id="2"]')})
        await lizzardRow.getByRole('button', {name:'Edit'}).click()

        // 4. On the Edit Pet Type page, clear the input field
        const updateName = page.locator('input[name="name"]')
        await expect(updateName).not.toHaveValue('')
        await updateName.clear()
        
        // 5. Add the assertion for the "Name is required" message below the input field
        await page.getByText('Name is required')

        // 6. Click on "Update" button
        const updateButton = page.getByRole('button', {name:'Update'})
        await updateButton.click()

        // 7. Add assertion that "Edit Pet Type" page is still displayed
        await expect(page.getByRole('heading', {name:'Edit Pet Type'})).toHaveText('Edit Pet Type')

        // 8. Click on the "Cancel" button
        const cancelButton = page.getByRole('button', {name:'Cancel'})
        await cancelButton.click()

        // 9. Add assertion that "Pet Types" page is displayed
        await expect(page.getByRole('heading', {name:'Pet Types'})).toHaveText('Pet Types')
    })

})
