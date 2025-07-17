export const validateExperience = (experience) => {
    const errors = [];

    if (!experience.jobTitle ? .trim()) {
        errors.push('Job title is required');
    }
    if (!experience.company ? .trim()) {
        errors.push('Company name is required');
    }
    if (!experience.startDate) {
        errors.push('Start date is required');
    }
    if (!experience.description ? .trim()) {
        errors.push('Description is required');
    }

    return errors;
};

export const validateEducation = (education) => {
    const errors = [];

    if (!education.degree ? .trim()) {
        errors.push('Degree is required');
    }
    if (!education.institution ? .trim()) {
        errors.push('Institution name is required');
    }
    if (!education.year ? .trim()) {
        errors.push('Year is required');
    }

    return errors;
};