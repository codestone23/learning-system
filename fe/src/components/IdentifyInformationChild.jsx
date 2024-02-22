/* eslint-disable react/prop-types */
import ArrowRight from '../components/icons/ArrowRight'

function IdentifyInformationChild({titleChild, content}){
    return (
        <div>
            <div className='vertical'></div>
            <div className='basic__info--body basic__info--body__more'>
                <a href="" className='basic__info--body__content basic__info--body__content--link' >
                    <div className='basic__info--parent'>
                        <div className='basic__info--child'>
                            <div className='basic__info--body__content--photo'>
                                <div className='basic__info--photo'>
                                    <div>
                                        <div>{titleChild}</div>
                                    </div>
                                </div>
                                <div className='basic__info--discription'>
                                    <div>
                                        <div className='basic__info--discription__content'>{content}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <figure className='basic__info--icon'>
                            <ArrowRight />
                            </figure>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    )

}

export default IdentifyInformationChild;