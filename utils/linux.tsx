enum LinuxOperatingSystems {
  ubuntu = 'Ubuntu',
  debian = 'Debian',
  centos = 'CentOS',
  redhat = 'RedHat',
  gentoo = 'Gentoo',
  fedora = 'Fedora',
  suse = 'SUSE',
  opensuse = 'OpenSuse',
  mint = 'Mint',
  arch = 'Arch',
  manjaro = 'Manjaro',
  slackware = 'Slackware',
  mageia = 'Mageia',
  lubuntu = 'Lubuntu',
  knoppix = 'Knoppix',
  deepin = 'Deepin',
  linpus = 'Linpus',
  linux = 'Linux',
  linspire = 'Linspire',
  mandriva = 'Mandriva',
  meego = 'MeeGo',
  pclinuxos = 'PCLinuxOS',
  raspbian = 'Raspbian',
  sabayon = 'Sabayon',
  tizen = 'Tizen',
  vectorlinux = 'VectorLinux',
  zenwalk = 'Zenwalk'
}

/**
 * @param operatingSystem
 */
export function isLinuxOS(operatingSystem: string) {
  return !!LinuxOperatingSystems[operatingSystem?.toLowerCase()];
}
