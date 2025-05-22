import React, { useEffect } from 'react';

export const BuyMeACoffeeButton = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.setAttribute('data-name', 'BMC-Widget');
        script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js';
        script.setAttribute('data-id', 'magicswissweed');
        script.setAttribute('data-description', 'Support us on Buy me a coffee!');
        script.setAttribute('data-message', '');
        script.setAttribute('data-color', '#FFDD00');
        script.setAttribute('data-position', 'right');
        script.setAttribute('data-x_margin', '18');
        script.setAttribute('data-y_margin', '18');
        
        document.head.appendChild(script);

        return () => {
            // Cleanup
            const widget = document.querySelector('script[data-name="BMC-Widget"]');
            if (widget) {
                document.head.removeChild(widget);
            }
            // Remove the button if it exists
            const button = document.querySelector('.bmc-btn');
            if (button) {
                button.remove();
            }
        };
    }, []);

    return (
        <a 
            className="bmc-button" 
            target="_blank" 
            href="https://www.buymeacoffee.com/magicswissweed"
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: '38px',
                padding: '0 12px',
                backgroundColor: '#FFDD00',
                color: '#000000',
                border: 'none',
                borderRadius: '5px',
                // fontSize: '14px',
                textDecoration: 'none',
                cursor: 'pointer'            
              }}
        >
            <img 
                src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg" 
                alt="Buy me a coffee"
                style={{
                    height: '20px',
                    width: '20px',
                    marginRight: '8px'
                }}
            />
            <span>Buy us a coffee</span>
        </a>
    );
};