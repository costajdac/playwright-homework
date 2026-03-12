import { test, expect } from '@playwright/test';

test.beforeEach( async ({page}) => {
  await page.goto('/')
})

test.describe('Checkboxes', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Select the VETERINARIANS menu item, then select "All"
    await page.getByRole('button', {name:'Veterinarians'}).click()
    await page.getByRole('link', {name:'All'}).click()
  })
  test('Validate selected specialties', async ({ page }) => {
    // 2. Add assertion of the "Veterinarians" text displayed above the table with
    // the list of Veterinarians
    await expect(page.getByRole('heading')).toHaveText('Veterinarians')

    // 3. Select the veterinarian "Helen Leary" and click "Edit Vet" button
    await page.getByRole('row', {name:'Helen Leary'}).getByRole('button', {name:'Edit'}).click()

    // 4. Add assertion of the "Specialties" field. The value "radiology" is displayed
    const specialtiesDropDown = page.locator('.selected-specialties')
    await expect(specialtiesDropDown).toHaveText('radiology')
  
    // 5. Click on the "Specialties" drop-down menu
    await specialtiesDropDown.click()

    // 6. Add assertion that "radiology" specialty is checked
    const radiologyCheckbox = page.getByRole('checkbox', {name:'radiology'})
    expect(radiologyCheckbox.isChecked).toBeTruthy()

    // 7. Add assertion that "surgery" and "dentistry" specialties are unchecked
    const surgeryCheckbox = page.getByRole('checkbox', {name:'surgery'})
    expect(surgeryCheckbox.isChecked).toBeTruthy()
    const dentistryCheckbox = page.getByRole('checkbox', {name:'dentistry'})
    expect(dentistryCheckbox.isChecked).toBeTruthy()

    // 8. Check the "surgery" item specialty and uncheck the "radiology" item speciality 
    await surgeryCheckbox.check()
    await radiologyCheckbox.uncheck()
    
    // 9. Add assertion of the "Specialties" field displayed value "surgery"
    await expect(specialtiesDropDown).toContainText('surgery')

    // 10. Check the "dentistry" item specialty
    await dentistryCheckbox.check()

    // 11. Add assertion of the "Specialties" field. The value "surgery, dentistry" is displayed
    await expect(specialtiesDropDown).toHaveText('surgery, dentistry')
})

test('Select All Specialties', async({page}) => {
    // 2. Select the veterinarian "Rafael Ortega" and click "Edit Vet" button
    await page.getByRole('row', {name:'Rafael Ortega'}).getByRole('button', {name:'Edit'}).click()
    
    // 3. Add assertion that "Specialties" field is displayed value "surgery"
    const specialtiesDropDown = page.locator('.selected-specialties')
    await expect(specialtiesDropDown).toHaveText('surgery')
    
    // 4. Click on the "Specialties" drop-down menu
    await specialtiesDropDown.click()
    
    // 5. Check all specialties from the list
    // 6. Add assertion that all specialties are checked
    const allSpecialtiesDropDownContent = page.getByRole('checkbox')
    for(const item of await allSpecialtiesDropDownContent.all()){
      await item.check()
      expect(item.isChecked).toBeTruthy()
    }
  
    // 7. Add assertion that all checked specialities are displayed in the "Specialties" field
    await expect(specialtiesDropDown).toHaveText('surgery, radiology, dentistry')
})

test('unselect all specialties', async({page}) => {
    // 2. Select the veterinarian "Linda Douglas" and click "Edit Vet" button
    await page.getByRole('row', {name:'Linda Douglas'}).getByRole('button', {name:'Edit'}).click()

    // 3. Add assertion of the "Specialties" field displayed value "surgery, dentistry"
    const specialtiesDropDown = page.locator('.selected-specialties')
    await expect(specialtiesDropDown).toHaveText('dentistry, surgery')

    // 4. Click on the "Specialties" drop-down menu
    await specialtiesDropDown.click()

    // 5. Uncheck all specialties from the list
    // 6. Add assertion that all specialties are unchecked
    const allSpecialtiesDropDownContent = page.getByRole('checkbox')
    for(const item of await allSpecialtiesDropDownContent.all()){
      await item.uncheck()
      expect(await item.isChecked()).toBeFalsy()
    }
    
    // 7. Add assertion that "Specialties" field is empty
    await expect(specialtiesDropDown).toHaveText('')
})
})