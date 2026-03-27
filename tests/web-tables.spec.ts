import { test, expect } from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('/')
})

test.describe('Web Table', () => {

    test.beforeEach(async({page}) => {
        // 1. Select the OWNERS menu item in the navigation bar and then select "Search" from the drop-down menu
        await page.getByRole('button', {name:'Owners'}).click()
        await page.getByRole('link', {name:'Search'}).click()
        // await page.locator('.table').waitFor({ state: 'visible' })
    })

    test('Validate the pet name city of the owner', async({page}) => {    
        // 2. In the list of Owners, locate the owner by the name "Jeff Black". Add the assertions that this owner is from the city of "Monona" and he has a pet with a name "Lucky"
        const ownerCityCell = page.getByRole('row', {name:'Jeff Black'}).locator('td').nth(2)
        await expect(ownerCityCell).toHaveText('Monona')
        const petNameCell = page.getByRole('row', {name:'Jeff Black'}).locator('td').last()
        await expect(petNameCell).toHaveText('Lucky')
    })

    test('Validate owners count of the Madison City', async({page}) => {
        // 2. In the list of Owners, locate all owners who live in the city of "Madison". Add the assertion that the total number of owners should be 4
        await expect(page.getByRole('row', {name:'Madison'})).toHaveCount(4)
    })

    test('Validate Search by last name', async({page}) => {
        // 2. On the Owners page, in the "Last name" input field, type the last name "Black" and click the  "Find Owner" button
        await page.locator('.table').waitFor({ state: 'visible' })
        const lastNameSearchInputField = page.locator('#lastName')
        const ownerNames = page.locator('tbody .ownerFullName')

        const searchLastNames = [
            ['Black', ['Jeff Black']],
            ['Davis', ['Betty Davis', 'Harold Davis']],
            ['Es', ['Maria Escobito', 'Carlos Estaban']],
            ['Playwright', []]
            ]

        for(let searchItem of searchLastNames){
            const searchValue = searchItem[0]
            const expectedName = searchItem[1]

            await lastNameSearchInputField.clear()
            await lastNameSearchInputField.fill(searchValue)
            await page.getByRole('button', {name:'Find Owner'}).click()
            
            if(expectedName.length === 0){
                await page.locator('.table').waitFor({ state: 'hidden' })
                await expect(page.locator('.xd-container')).toContainText(`No owners with LastName starting with "${searchValue}"`, {timeout:10000})
            } else {
                await expect(ownerNames).toHaveText(expectedName, {timeout:10000})
            }
        }
    })

    test('Validate phone number and pet name on the owner information page', async({page}) => {
        // 2. Locate the owner by the phone number "6085552765". Extract the Pet name displayed in the table for the owner and save it to the variable. Click on this owner.
        const targetOwnerTableRow = page.getByRole('row', {name: '6085552765'})
        const ownersPetNameFromTable = await targetOwnerTableRow.locator('td').last().innerText()


        // 3. On the Owner Information page, add the assertion that "Telephone" value in the Owner Information card is "6085552765"
        const telephoneRow = page.locator('tr', {has: page.locator('th', { hasText: 'Telephone' })})
        await expect(telephoneRow.locator('td')).toHaveText('6085552765')

        // 4. Add the assertion that Pet Name in the Owner Information card matches the name extracted from the page in step 2
        const firstPetNamePetsAndVisits = page.locator('app-pet-list').first().locator('dd').first()
        await expect(firstPetNamePetsAndVisits).toHaveText(ownersPetNameFromTable)
    })

    test('validate pets of Madison city', async({page}) => {
        // 2. On the Owners page, perform the assertion that Madison city has a list of pets: Leo, George, Mulligan, and Freddy
        const madisonRows = page.getByRole('row', {name:'Madison'})
        await expect(madisonRows.locator('tr')).toHaveText(['Leo', 'George', 'Mulligan', 'Freddy'])
    })
})

test.describe('Validate Veterinarians Page', () => {
    test('Validate specialty update', async({page}) => {
        // 1. Select the VETERINARIANS menu item in the navigation bar, then select "All"
        await page.getByRole('button', {name:'Veterinarians'}).click()
        await page.getByRole('link', {name:'All'}).click()

        // 2. On the Veterinarians page, add the assertion that "Rafael Ortega" has specialty "surgery"
        await expect(page.getByRole('row', {name:'Rafael Ortega'}).locator('td').nth(1)).toHaveText('surgery')
        
        // 3. Select the SPECIALTIES menu item in the navigation bar
        await page.getByRole('link', {name:'specialties'}).click()

        // 4. Add assertion of the "Specialties" header displayed above the table
        await expect(page.getByRole('heading')).toHaveText('Specialties')

        // 5. Click on "Edit" button for the "surgery" specialty
        const specialitiesRow = page.locator('tbody tr', {has: page.locator('[id="1"]')})
        await specialitiesRow.getByRole('button', {name:'Edit'}).click()

        // 6. Add assertion "Edit Specialty" page is displayed
        await expect(page.getByRole('heading')).toHaveText('Edit Specialty')

        // 7. Update the specialty from "surgery" to "dermatology" and click "Update button"
        await expect(page.locator('input[name="name"]')).toHaveValue('surgery')
        await page.locator('input[name="name"]').fill('dermatology')
        await page.getByRole('button', {name:'Update'}).click()

        // 8. Add an assertion that "surgery" was changed to "dermatology" in the list of specialties
        await expect(specialitiesRow.locator('[id="1"]')).toHaveValue('dermatology')

        // 9. Select the VETERINARIANS menu item in the navigation bar, then select "All"
        await page.getByRole('button', {name:'Veterinarians'}).click()
        await page.getByRole('link', {name:'All'}).click()

        // 10. On the Veterinarians page, add an assertion that "Rafael Ortega" has specialty in dermatology"
        await expect(page.getByRole('row', {name:'Rafael Ortega'}).locator('td').nth(1)).toHaveText('dermatology')

        // 11. Navigate to the SPECIALTIES page, revert the changes, renaming "dermatology" back to "surgery"
        await page.getByRole('link', {name:'specialties'}).click()
        await specialitiesRow.getByRole('button', {name:'Edit'}).click()
        await expect(page.locator('input[name="name"]')).toHaveValue('dermatology')
        await page.locator('input[name="name"]').fill('surgery')
        await page.getByRole('button', {name:'Update'}).click()
        await expect(specialitiesRow.locator('[id="1"]')).toHaveValue('surgery')
    })

    test('Validate Specialty Lists', async({page}) => {
        // 1. Select the SPECIALTIES menu item in the navigation bar
        await page.getByRole('link', {name:'Specialties'}).click()

        // 2. On the Specialties page, select "Add" button. Type the new specialty "oncology" and click "Save" button
        await page.getByRole('button', {name:'Add'}).click()
        await page.locator('input[name="name"]').fill('oncology')
        await page.getByRole('button', {name:'Save'}).click()
        await page.waitForResponse('https://petclinic-api.bondaracademy.com/petclinic/api/specialties')
        
        // 3. Extract all values of specialties and put them into the array.
        const allSpecialtiesArray: string [] = []
        const allValuesOfSpecialities = page.locator('input[name="spec_name"]')

        for(let input of await allValuesOfSpecialities.all()){
            const value = await input.inputValue()
            allSpecialtiesArray.push(value)
        }

        // 4. Select the VETERINARIANS menu item in the navigation bar, then select "All"
        await page.getByRole('button', {name:'Veterinarians'}).click()
        await page.getByRole('link', {name:'All'}).click()

        // 5. On the Veterinarians page, locate the "Sharon Jenkins" in the list and click "Edit" button
        const vetSharonJenkinsRow = page.getByRole('row', {name:'Sharon Jenkins'})
        await vetSharonJenkinsRow.getByRole('button', {name:'Edit Vet'}).click()

        // 6. Click on the Specialties drop-down menu. Extract all values from the drop-down menu to an array
        const allSpecialtiesDropDown: string [] = []
        await page.locator('.dropdown-display').click()
        
        const dropdownSpecialtyItems = page.locator('.dropdown-content > div')
        for(let item of await dropdownSpecialtyItems.all()){
            const itemValue = await item.innerText()
            allSpecialtiesDropDown.push(itemValue)
        }

        // 7. Add the assertion that the array of specialties collected in step 3 is equal the the array from drop-down menu
        expect(allSpecialtiesArray).toEqual(allSpecialtiesDropDown)

        // 8. Select the "oncology" specialty and click "Save vet" button
        await page.getByRole('checkbox', {name:'oncology'}).check()
        await page.locator('.dropdown-display').click()
        await page.getByRole('button', {name:'Save Vet'}).click()
        
        // 9. On the Veterinarians page, add assertion that "Sharon Jenkins" has a specialty "oncology"
        await expect(vetSharonJenkinsRow.getByRole('cell', {name:'oncology'})).toBeVisible()

        // 10. Navigate to the SPECIALTIES page. Click "Delete" for "oncology" specialty
        await page.getByRole('link', {name:'Specialties'}).click()
        await page.getByRole('row', {name:'oncology'}).getByRole('button', {name:'Delete'}).click()

        // 11. Navigate to the VETERINARIANS page. Add an assertion that "Sharon Jenkins" has no specialty assigned
        await page.getByRole('button', {name:'Veterinarians'}).click()
        await page.getByRole('link', {name:'All'}).click()
        await expect(vetSharonJenkinsRow.getByRole('cell').nth(1)).toBeEmpty()

        // Hint: For step 3, create an empty array, then loop through the list of the table rows, getting the value for each row and adding to the array
    })
})