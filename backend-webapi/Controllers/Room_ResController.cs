using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReservationApp.Services;
using System;
using System.Threading.Tasks;
namespace Reservation.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class RoomResController : ControllerBase
    {
        private readonly IRoomResService _roomResService; 
        private readonly IUserService _userService; 
        private readonly IRoomService _roomService; 

        public RoomResController(IRoomResService roomResService, IUserService userService, IRoomService roomService)
        {
            _roomResService = roomResService;
            _userService = userService;
            _roomService = roomService;
        }

        // GET /api/v1/room-res
        [HttpGet]
        public async Task<IActionResult> GetAllRoomReservations()
        {
            try
            {
                var roomReservations = await _roomResService.GetAllAsync();
                return Ok(roomReservations);
            }
            catch (Exception ex)
            {
                // Handle exception
                return StatusCode(500, ex.Message);
            }
        }

        // POST /api/v1/room-res
        [HttpPost]
        public async Task<IActionResult> SubmitRoomReservation([FromBody] RoomReservationDto roomReservationDto)
        {
            try
            {
                var roomReservation = await _roomResService.SubmitAsync(roomReservationDto);
                var user = await _userService.GetAsync(roomReservationDto.NetID);

                // Set room to unavailable and assign it to the user
                await _roomService.UpdateRoomStatus(roomReservationDto.Building, roomReservationDto.Room, false, user.NetID, user.Name);

                return Ok(roomReservation);
            }
            catch (Exception ex)
            {
                // Handle exception
                return StatusCode(500, ex.Message);
            }
        }

        // PUT /api/v1/room-res/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> ProcessRoomReservation(int id, [FromBody] ReservationStatusUpdateDto updateDto)
        {
            try
            {
                var reservation = await _roomResService.GetAsync(id);

                if (updateDto.Status == "approved")
                {
                    await _roomResService.DeleteAsync(id);
                }
                else if (updateDto.Status == "denied")
                {
                    await _roomResService.DeleteAsync(id);
                    await _roomService.UpdateRoomStatus(reservation.Building, reservation.Room, true, null, null);
                }

                return Ok(new { message = "Reservation processed successfully." });
            }
            catch (Exception ex)
            {
                // Handle exception
                return StatusCode(500, ex.Message);
            }
        }
    }
}
