// Validation utility functions

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (basic validation)
 * @param {string} phone
 * @returns {boolean}
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate password strength
 * @param {string} password
 * @returns {Object} - { isValid: boolean, message: string }
 */
export const validatePassword = (password) => {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  if (password.length > 50) {
    return { isValid: false, message: 'Password must be less than 50 characters' };
  }
  return { isValid: true, message: 'Password is valid' };
};

/**
 * Validate date is not in the future
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {boolean}
 */
export const validatePastDate = (dateString) => {
  const inputDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate <= today;
};

/**
 * Validate date is in the future
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {boolean}
 */
export const validateFutureDate = (dateString) => {
  const inputDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate >= today;
};

/**
 * Validate address (basic check)
 * @param {string} address
 * @returns {boolean}
 */
export const validateAddress = (address) => {
  return address && address.trim().length >= 10;
};

/**
 * Validate required field
 * @param {any} value
 * @returns {boolean}
 */
export const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

/**
 * Validate number is positive
 * @param {number} value
 * @returns {boolean}
 */
export const validatePositiveNumber = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
};

/**
 * Validate package weight
 * @param {number} weight - Weight in kg
 * @param {string} packageType
 * @returns {Object} - { isValid: boolean, message: string }
 */
export const validatePackageWeight = (weight, packageType) => {
  const weightNum = parseFloat(weight);

  if (isNaN(weightNum) || weightNum <= 0) {
    return { isValid: false, message: 'Weight must be a positive number' };
  }

  const maxWeights = {
    document: 1,
    small: 5,
    medium: 15,
    large: 30
  };

  const maxWeight = maxWeights[packageType];
  if (maxWeight && weightNum > maxWeight) {
    return {
      isValid: false,
      message: `Weight exceeds maximum for ${packageType} package (${maxWeight}kg)`
    };
  }

  return { isValid: true, message: 'Weight is valid' };
};

/**
 * Sanitize input string (remove potentially harmful characters)
 * @param {string} input
 * @returns {string}
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim();
};

/**
 * Validate booking form data
 * @param {Object} formData
 * @param {string} serviceType
 * @returns {Object} - { isValid: boolean, errors: Array }
 */
export const validateBookingForm = (formData, serviceType) => {
  const errors = [];

  // Common validations
  if (!validateRequired(formData.deliveryAddress)) {
    errors.push('Delivery address is required');
  } else if (!validateAddress(formData.deliveryAddress)) {
    errors.push('Delivery address must be at least 10 characters');
  }

  // Service-specific validations
  switch (serviceType) {
    case 'grocery':
      if (!formData.items || formData.items.length === 0) {
        errors.push('At least one item is required');
      }
      if (!validateFutureDate(formData.deliveryDate)) {
        errors.push('Delivery date must be today or in the future');
      }
      break;

    case 'medication':
      if (!validateRequired(formData.medicationName)) {
        errors.push('Medication name is required');
      }
      if (!validateRequired(formData.prescriptionNumber)) {
        errors.push('Prescription number is required');
      }
      break;

    case 'covid-testing':
      if (!validateFutureDate(formData.testDate)) {
        errors.push('Test date must be today or in the future');
      }
      if (!validateRequired(formData.testTime)) {
        errors.push('Test time is required');
      }
      break;

    case 'parcel':
      const weightValidation = validatePackageWeight(
        formData.packageWeight,
        formData.packageType
      );
      if (!weightValidation.isValid) {
        errors.push(weightValidation.message);
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Format error messages for display
 * @param {Array} errors
 * @returns {string}
 */
export const formatErrorMessages = (errors) => {
  if (!errors || errors.length === 0) return '';
  return errors.join('\n');
};
