import React from 'react';

const PageRenderer = ({ blocks }) => {
    if (!blocks || blocks.length === 0) {
        return null;
    }

    const renderBlock = (block) => {
        const { type, data, style } = block;

        switch (type) {
            case 'hero':
                return (
                    <div className="rendered-hero" style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', ...style }}>
                        <h1 style={{ fontSize: 'var(--fs-p1)', marginBottom: '1rem', fontFamily: 'var(--heading-font)' }}>{data.title}</h1>
                        <p style={{ fontSize: 'var(--fs-p1)', marginBottom: '2rem', opacity: 0.8 }}>{data.subtitle}</p>
                        {data.primaryButtonText && (
                            <a
                                href={data.primaryButtonLink || '#'}
                                style={{ padding: '0.8rem 2rem', backgroundColor: 'var(--primary-color)', color: '#fff', borderRadius: '50px', display: 'inline-block', textDecoration: 'none', fontWeight: 'bold' }}
                            >
                                {data.primaryButtonText}
                            </a>
                        )}
                    </div>
                );
            case 'text':
                return (
                    <div className="rendered-text" style={{ fontSize: 'var(--fs-p2)', lineHeight: 1.6, ...style }}>
                        {data.content}
                    </div>
                );
            case 'image':
                return (
                    <div className="rendered-image" style={{ ...style, textAlign: 'center' }}>
                        <img src={data.url} alt={data.alt} style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
                    </div>
                );
            case 'form':
                return (
                    <div className="rendered-form" style={style}>
                        <h3>{data.title}</h3>
                        {/* Placeholder for actual form rendering logic */}
                        <form onSubmit={(e) => { e.preventDefault(); console.log('Form submitted!'); }}>
                            <input type="text" placeholder="Your Name" style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%', maxWidth: '300px' }} />
                            <input type="email" placeholder="Your Email" style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%', maxWidth: '300px' }} />
                            <textarea placeholder="Your Message" style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%', maxWidth: '300px', height: '100px' }}></textarea>
                            <button type="submit" style={{ padding: '8px 16px', background: 'var(--primary-color, #000)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Submit</button>
                        </form>
                    </div>
                );
            case 'custom_code':
                return (
                    <div
                        className="rendered-custom-code"
                        style={style}
                        dangerouslySetInnerHTML={{ __html: data.html }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="page-renderer">
            {blocks.map((block) => {
                const isLink = block.style?.linkUrl;
                const content = renderBlock(block);

                return (
                    <div key={block.id} className="rendered-block-wrapper" style={{ cursor: isLink ? 'pointer' : 'default' }}>
                        {isLink ? (
                            <a href={block.style.linkUrl} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                {content}
                            </a>
                        ) : content}
                    </div>
                );
            })}
        </div>
    );
};

export default PageRenderer;
