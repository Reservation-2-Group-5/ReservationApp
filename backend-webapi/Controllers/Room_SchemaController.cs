using Microsoft.AspNetCore.Mvc;
using ReservationApp.Models;
using ReservationApp.Services;


namespace Reservation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomResController : ControllerBase
    {
       
        private readonly IRoomResService _service;

        public RoomResController(IRoomResService service)
        {
            _service = service;
        }

        // GET: api/RoomRes
        [HttpGet]
        public async Task<IActionResult> GetRoomReservations()
        {
            var roomReservations = await _service.GetAllRoomReservations();
            return Ok(roomReservations);
        }

        // GET: api/RoomRes/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoomReservation(long id)
        {
            var roomReservation = await _service.GetRoomReservationById(id);
            if (roomReservation == null)
            {
                return NotFound();
            }
            return Ok(roomReservation);
        }

        // POST: api/RoomRes
        [HttpPost]
        public async Task<IActionResult> CreateRoomReservation([FromBody] RoomRes roomRes)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdRoomRes = await _service.CreateRoomReservation(roomRes);
            return CreatedAtAction(nameof(GetRoomReservation), new { id = createdRoomRes.NetID }, createdRoomRes);
        }

        // PUT: api/RoomRes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoomReservation(long id, [FromBody] RoomRes roomRes)
        {
            if (id != roomRes.NetID)
            {
                return BadRequest();
            }

            try
            {
                await _service.UpdateRoomReservation(roomRes);
            }
            catch (Exception)
            {
                // Check if the room reservation exists
                var exists = await _service.RoomReservationExists(id);
                if (!exists)
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/RoomRes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoomReservation(long id)
        {
            var roomReservation = await _service.DeleteRoomReservation(id);
            if (roomReservation == null)
            {
                return NotFound();
            }

            return Ok(roomReservation);
        }
    }
}