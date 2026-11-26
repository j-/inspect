// Permission name candidates and descriptor requirements
// - W3C Permissions Registry: https://w3c.github.io/permissions-registry/
// - Chromium ParsePermissionDescriptor: https://chromium.googlesource.com/chromium/src/+/main/third_party/blink/renderer/modules/permissions/permission_utils.cc
// - Gecko Permissions WebIDL: https://github.com/mozilla/gecko-dev/blob/master/dom/webidl/Permissions.webidl
// - WebKit PermissionName WebIDL: https://github.com/WebKit/WebKit/blob/main/Source/WebCore/Modules/permissions/PermissionName.idl
// Includes legacy Chromium names and policy candidates. The route also adds names
// from the document's policy APIs and keeps descriptors accepted by the browser.
export const knownPermissionNames = [
  'accelerometer',
  'accessibility-events',
  'ambient-light-sensor',
  'background-fetch',
  'background-sync',
  'bluetooth',
  'camera',
  'captured-surface-control',
  'clipboard-read',
  'clipboard-write',
  'compute-pressure',
  'display-capture',
  'fullscreen',
  'geolocation',
  'geolocation-approximate',
  'gyroscope',
  'idle-detection',
  'keyboard-lock',
  'local-fonts',
  'local-network',
  'local-network-access',
  'loopback-network',
  'magnetometer',
  'microphone',
  'midi',
  'nfc',
  'notifications',
  'payment-handler',
  'periodic-background-sync',
  'persistent-storage',
  'pointer-lock',
  'publickey-credentials-remote-client-data-json',
  'push',
  'screen-wake-lock',
  'speaker-selection',
  'storage-access',
  'system-wake-lock',
  'web-app-installation',
  'window-management',
  'window-placement',
] as const;

export const queryPermission = async (name: string): Promise<PermissionStatus> => {
  const descriptor = {
    name: name as PermissionName,
    ...(name === 'push' ? { userVisibleOnly: true } : {}),
    ...(name === 'fullscreen' ? { allowWithoutGesture: true } : {}),
  };

  return navigator.permissions.query(descriptor);
};
