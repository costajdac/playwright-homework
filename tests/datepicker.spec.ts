import { test, expect } from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('/')
})

test.describe('DatePickers', () => {
    test.beforeEach(async({page}) => {
        // 1. Select the OWNERS menu item in the navigation bar and then select "Search" from the drop-down menu
        await page.getByRole('button', {name:'Owners'}).click()
        await page.getByRole('link', {name:'Search'}).click()
    })

    test('Select the desired date in the calendar', async({page}) => {
        // 2. In the list of the Owners, locate the owner by the name "Harold Davis" and select this owner
        await page.getByRole('link', {name:'Harold Davis'}).click()

        // 3. On the Owner Information page, select the "Add New Pet" button
        await page.waitForLoadState('networkidle')
        await page.getByRole('button', {name:'Add New Pet'}).click()

        // 4. In the Name field, type any new pet name, for example, "Tom"
        const petNameInputField = page.locator('input[name="name"]')
        const formGroup = page.locator('.form-group', {has: petNameInputField})
        const validateIcon = formGroup.locator('.form-control-feedback')

        // 5. Add the assertion of icon in the input field, that it changed from "X" to "V"
        await expect(validateIcon).toHaveClass(/glyphicon-remove/)
        await petNameInputField.fill('Tom')
        await expect(validateIcon).toHaveClass(/glyphicon-ok/)

        // 6. Click on the calendar icon for the "Birth Date" field
        const calendarInput = page.locator('input[name="birthDate"]')
        await page.getByRole('button', {name:'Open calendar'}).click()

        // 7. Using the calendar selector, select the date "May 2nd, 2014"
        await page.getByRole('button', {name:'Choose month and year'}).click()
        await page.getByRole('button', {name:'Previous 24 years'}).click()
        await page.getByRole('button', {name:'2014'}).click()
        await page.getByText('MAY').click()
        await page.getByText('2', {exact: true}).click()

        // 8. Add the assertion of the input field is in the format "2014/05/02"
        await expect(calendarInput).toHaveValue('2014/05/02')

        // 9. Select the type of pet "dog" and click "Save Pet" button
        const selectedPetDropDownField = page.getByLabel('Type')
        await selectedPetDropDownField.selectOption('dog')
        await page.getByRole('button', {name:'Save Pet'}).click()

        // 10. On the Owner Information page, add assertions for the newly created pet. Name is Tom, Birth Date is in the format "2014-05-02", Type is dog
        const petAndVisitsSection =  page.locator('app-pet-list', { hasText: 'Tom'})
        await expect(petAndVisitsSection.locator('dd').nth(0)).toHaveText('Tom')
        await expect(petAndVisitsSection.locator('dd').nth(1)).toHaveText('2014-05-02')
        await expect(petAndVisitsSection.locator('dd').nth(2)).toHaveText('dog')

        // 11. Click the "Delete Pet" button for the new pet "Tom"
        await petAndVisitsSection.getByRole('button', {name:'Delete Pet'}).click()

        // 12. Add an assertion that Tom does not exist in the list of pets anymore
        await expect(petAndVisitsSection).not.toHaveText('Tom')

        // Hint: To add the assertion for step 5, analyze what is changed in the DOM when the icon is changed
    })

    test('Select the desired date in the calendar - JS date', async({page}) => {
        // 2. In the list of the Owners, locate the owner by the name "Harold Davis" and select this owner
        await page.getByRole('link', {name:'Harold Davis'}).click()

        // 3. On the Owner Information page, select the "Add New Pet" button
        await page.waitForLoadState('networkidle')
        await page.getByRole('button', {name:'Add New Pet'}).click()

        // 4. In the Name field, type any new pet name, for example, "Tom"
        const petNameInputField = page.locator('input[name="name"]')
        const formGroup = page.locator('.form-group', {has: petNameInputField})
        const validateIcon = formGroup.locator('.form-control-feedback')

        // 5. Add the assertion of icon in the input field, that it changed from "X" to "V"
        await expect(validateIcon).toHaveClass(/glyphicon-remove/)
        await petNameInputField.fill('Tom')
        await expect(validateIcon).toHaveClass(/glyphicon-ok/)

        // 6. Click on the calendar icon for the "Birth Date" field
        const calendarInput = page.locator('input[name="birthDate"]')
        await page.getByRole('button', {name:'Open calendar'}).click()
        
        // 7. Using the calendar selector, select the date "May 2nd, 2014"
        let date = new Date(2014, 4, 2)
        const expectedYear = date.getFullYear().toString()
        const expectedMonth = date.toLocaleString('en-US', {month:'short'})
        const expetedDay = date.getDate().toString()

        await page.getByRole('button', {name:'Choose month and year'}).click()
        await page.getByRole('button', {name:'Previous 24 years'}).click()
        await page.getByRole('button', {name: expectedYear}).click()
        await page.getByText(expectedMonth).click()
        await page.getByText(expetedDay, {exact: true}).click()

        // 8. Add the assertion of the input field is in the format "2014/05/02"
        await expect(calendarInput).toHaveValue('2014/05/02')

        // 9. Select the type of pet "dog" and click "Save Pet" button
        const selectedPetDropDownField = page.getByLabel('Type')
        await selectedPetDropDownField.selectOption('dog')
        await page.getByRole('button', {name:'Save Pet'}).click()

        // 10. On the Owner Information page, add assertions for the newly created pet. Name is Tom, Birth Date is in the format "2014-05-02", Type is dog
        const petAndVisitsSection =  page.locator('app-pet-list', { hasText: 'Tom'})
        await expect(petAndVisitsSection.locator('dd').nth(0)).toHaveText('Tom')
        await expect(petAndVisitsSection.locator('dd').nth(1)).toHaveText('2014-05-02')
        await expect(petAndVisitsSection.locator('dd').nth(2)).toHaveText('dog')

        // 11. Click the "Delete Pet" button for the new pet "Tom"
        await petAndVisitsSection.getByRole('button', {name:'Delete Pet'}).click()

        // 12. Add an assertion that Tom does not exist in the list of pets anymore
        await expect(petAndVisitsSection).not.toHaveText('Tom')
    })

    test('Select the dates of visits and validate dates order', async({page}) => {
        // 2. In the list of the Owners, locate the owner by the name "Jean Coleman" and select this owner
        await page.getByRole('link', {name:'Jean Coleman'}).click()

        // 3. In the list of pets, locate the pet with a name "Samantha" and click "Add Visit" button
        const samanthaPetInformationSection =  page.locator('app-pet-list', {has: page.locator('dd',  {hasText: 'Samantha'})})
        const AddPetVisitButton = samanthaPetInformationSection.getByRole('button', {name:'Add Visit'})
        await AddPetVisitButton.click()

        // 4. Add the assertion that "New Visit" is displayed as the header of the page
        await expect(page.getByRole('heading')).toHaveText('New Visit')
        await page.waitForLoadState('networkidle')

        // 5. Add the assertion that the pet name is "Samantha" and owner's name is "Jean Coleman"
        const samanthaNewVisitPetRow = page.locator('table tr', {hasText:'Samantha'})
        await expect(samanthaNewVisitPetRow.getByRole('cell').last()).toHaveText('Jean Coleman')

        // 6. Click on the calendar icon and select the current date in date picker
        await page.getByRole('button', {name:'Open calendar'}).click()

        let date = new Date()
        let dayOfVisit = date.getDate().toString()
        let monthOfVisit = date.toLocaleString('en-US', {month:'2-digit'})
        let yearOfVisit = date.getFullYear().toString()
        const dateToAssert = `${yearOfVisit}/${monthOfVisit}/${dayOfVisit}`

        await page.locator('.mat-calendar-body-today').click()
        const dateInputField = page.locator('input[name="date"]')

        // 7. Add an assertion that the selected date is displayed and it is in the format "YYYY/MM/DD"
        expect(await dateInputField.inputValue()).toEqual(dateToAssert)

        // 8. Type the description in the field, for example, "dermatologists visit" and click "Add Visit" button
        await page.locator('input[name="description"]').fill('dermatologists')
        await page.getByRole('button', {name:'Add Visit'}).click()

        // 9. Add an assertion that the selected date of visit is displayed at the top of the list of visits for "Samantha" pet on the "Owner Information" page and is in the format "YYYY-MM-DD"
        const dateOfVisitToAssert = `${yearOfVisit}-${monthOfVisit}-${dayOfVisit}`
        const samanthaVisitDates = samanthaPetInformationSection.locator('app-visit-list table tr td:first-child')
        await expect(samanthaVisitDates.first()).toHaveText(dateOfVisitToAssert)

        // 10. Add one more visit for "Samantha" pet by clicking "Add Visit" button
        await AddPetVisitButton.click()
        
        // 11. Click on the calendar icon and select the date which is 45 days back from the current date
        await page.getByRole('button', {name:'Open calendar'}).click()
        date.setDate(date.getDate() - 45)
        dayOfVisit = date.getDate().toString()
        monthOfVisit = date.toLocaleString('en-US', {month:'short'})
        yearOfVisit = date.getFullYear().toString()

        await page.getByRole('button', {name:'Choose month and year'}).click()
        await page.getByRole('button', {name: yearOfVisit}).click()
        await page.getByText(monthOfVisit).click()
        await page.getByText(dayOfVisit, {exact: true}).click()

        // 12. Type the description in the field, for example, "massage therapy" and click "Add Visit" button
        await page.locator('input[name="description"]').fill('massage therapy')
        await page.getByRole('button', {name:'Add Visit'}).click()
        
        // 13. Add the assertion that the date added at step 11 is in chronological order in relation to the previous dates for "Samantha" pet on the "Owner Information" page. The date of visit above this date in the table should be greater.
        const firstVisitDateText = await samanthaVisitDates.nth(0).innerText()
        const secondVisitDateText = await samanthaVisitDates.nth(1).innerText()

        const firstVisitDate = new Date(firstVisitDateText)
        const secondVisitDate = new Date(secondVisitDateText)

        expect(firstVisitDate > secondVisitDate).toBeTruthy()
        
        // 14. Select the "Delete Visit" button for both newly created visits
        const dermatologistVisitRow = samanthaPetInformationSection.locator('app-visit-list table tr', {hasText:'dermatologists'})
        await dermatologistVisitRow.getByRole('button', {name:'Delete Visit'}).click()
        const massageVisitRow = samanthaPetInformationSection.locator('app-visit-list table tr', {hasText:'massage therapy'})
        await massageVisitRow.getByRole('button', {name:'Delete Visit'}).click()

        // 15. Add the assertion that deleted visits are no longer displayed in the table on "Owner Information" page
        await expect(dermatologistVisitRow).not.toBeVisible()
        await expect(massageVisitRow).not.toBeVisible()

        // Hint: To add the assertion for step 13, extract both values that you are going to compare from the table and assign them to the constants. Convert those "string" type values into the "date" type values and save those new values in the constants. Add an assertion with a condition, comparing two dates (constants), that it should be either "truthy" or "falsy"
    })
})