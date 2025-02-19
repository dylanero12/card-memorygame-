import PropTypes from 'prop-types'

const Card = ({ character, onClick }) => {
    return (
        <div className="card" onClick={() => onClick(character.id)}>
            <img src={character.imageUrl} alt={character.name} />
            <h3>{character.name}</h3>
        </div>
    )
}

Card.propTypes = {
    character: PropTypes.shape({
        name: PropTypes.string.isRequired,
        imageUrl: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired
    }).isRequired,
    onClick: PropTypes.func.isRequired
}

export default Card;


