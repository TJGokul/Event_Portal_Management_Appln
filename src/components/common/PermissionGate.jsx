import React from 'react';
import { useRole } from '../../hooks/useRole';

export const PermissionGate = ({ 
  permission, 
  children, 
  fallback = null, 
  showDisabled = false 
}) => {
  const { hasPermission } = useRole();
  const hasAccess = hasPermission(permission);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (showDisabled && React.isValidElement(children)) {
    // If showDisabled is true, clone the child and add disabled attribute
    return React.cloneElement(children, { 
      disabled: true, 
      className: `${children.props.className || ''} opacity-50 cursor-not-allowed`.trim(),
      title: "You do not have permission to perform this action"
    });
  }

  return <>{fallback}</>;
};
