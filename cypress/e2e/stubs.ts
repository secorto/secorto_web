const colorMode = (isDark: boolean, isMedia: boolean) => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onBeforeLoad (win: any) {
    const callback = cy.stub(win, 'matchMedia')
    callback.withArgs('(prefers-color-scheme: dark)')
      .as(`dark-mode ${isDark}`)
      .returns({
        matches: isDark,
      })
    callback
      .as(`matchMedia ${isMedia}`)
      .returns({
        matches: isMedia,
      })
  },
})

export const darkMode = () => colorMode(true, true)

export const lightMode = () => colorMode(false, true)
