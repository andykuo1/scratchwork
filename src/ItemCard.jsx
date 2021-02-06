import React, { useState } from 'react';
import Style from './ItemCard.module.css';

export function ItemCard(props)
{
    const { title, subtitle, description, blocks, portrait } = props;

    const [flipped, setFlipped] = useState(false);

    function onFlipClick()
    {
        setFlipped(flipped => !flipped);
    }

    return (
        <article className={Style.container
            + (flipped ? ' flipped' : '')}>
            <div className={Style.card}>
                <div className={Style.cardFront}>
                    <div className={Style.cardContent}>
                        <h3 className={Style.title}>
                            <span className={Style.content}>
                                {title||'???'}
                            </span>
                        </h3>
                        <div className={Style.background}>
                            {portrait}
                        </div>
                        <section className={Style.body}>
                            <h4 className={Style.subtitle}>
                                <span className={Style.content}>
                                    {subtitle||'???'}
                                </span>
                            </h4>
                            <div className={Style.info}>
                                <p className={Style.description}>
                                    {description}
                                </p>
                                {blocks && blocks.map(block => (
                                    <fieldset key={block.id}>
                                        <legend>{block.name || '???'}</legend>
                                        <p>
                                            {block.content}
                                        </p>
                                    </fieldset>
                                ))}
                            </div>
                        </section>
                        <button>
                            
                        </button>
                        <button className={Style.flipButton} onClick={onFlipClick}>
                            &#10150;
                        </button>
                    </div>
                </div>
                <div className={Style.cardBack}>
                    <div className={Style.cardContent}>
                        <button className={Style.flipButton} onClick={onFlipClick}>
                            &#10149;
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
