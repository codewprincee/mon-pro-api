export const defaultPlans = [
    {
        name: 'Free',
        description: 'Basic features for personal use',
        price: 0,
        billingCycle: 'monthly',
        features: [
            {
                name: 'projects',
                description: 'Number of active projects',
                limit: 1,
                isUnlimited: false
            },
            {
                name: 'storage',
                description: 'Storage space in GB',
                limit: 1,
                isUnlimited: false
            },
            {
                name: 'team_members',
                description: 'Team members per project',
                limit: 5,
                isUnlimited: false
            }
        ]
    },
    {
        name: 'Pro',
        description: 'Perfect for small teams',
        price: 19.99,
        billingCycle: 'monthly',
        features: [
            {
                name: 'projects',
                description: 'Number of active projects',
                limit: 10,
                isUnlimited: false
            },
            {
                name: 'storage',
                description: 'Storage space in GB',
                limit: 20,
                isUnlimited: false
            },
            {
                name: 'team_members',
                description: 'Team members per project',
                limit: 5,
                isUnlimited: false
            },
            {
                name: 'priority_support',
                description: 'Priority customer support',
                isUnlimited: true
            }
        ]
    },
    {
        name: 'Enterprise',
        description: 'For large organizations',
        price: 49.99,
        billingCycle: 'monthly',
        features: [
            {
                name: 'projects',
                description: 'Number of active projects',
                isUnlimited: true
            },
            {
                name: 'storage',
                description: 'Storage space in GB',
                limit: 100,
                isUnlimited: false
            },
            {
                name: 'team_members',
                description: 'Team members per project',
                isUnlimited: true
            },
            {
                name: 'priority_support',
                description: 'Priority customer support',
                isUnlimited: true
            },
            {
                name: 'custom_domain',
                description: 'Custom domain support',
                isUnlimited: true
            }
        ]
    }
];
